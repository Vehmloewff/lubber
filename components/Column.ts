import { Size, FlexSystemParams, FixedSize } from '../mod.ts'
import { elementWidget } from '../element-widget.ts'
import { setPosition } from '../utils.ts'

export function Column(params: FlexSystemParams) {
	return elementWidget('div', async ({ getChildPreferredSize }) => {
		const childrenPreferredSizes: Size[] = []

		for (const child of params.children) {
			childrenPreferredSizes.push(await getChildPreferredSize(child))
		}

		const preferredWidth = params.collapseMainAxis ? sumPreferredHeights(childrenPreferredSizes) : null
		const preferredHeight = params.collapseCrossAxis ? maxPreferredWidth(childrenPreferredSizes) : null

		return {
			async mount({ layout, mountChild, element }) {
				setPosition(element, layout)

				let spaceTaken = 0
				const childSizes: FixedSize[] = []
				const greedyChildrenIndexes: number[] = []

				// set the child sizes
				// greedy children (those with a preferred height of null) are set to height = 0
				for (const childPreferredSize of childrenPreferredSizes) {
					if (childPreferredSize.height === null) greedyChildrenIndexes.push(childSizes.length)
					else spaceTaken += childPreferredSize.height

					childSizes.push({
						width: params.crossAxisAlignment === 'stretch' ? layout.width : childPreferredSize.width ?? layout.width,
						height: childPreferredSize.height ?? 0,
					})
				}

				let extraSpace = layout.height - spaceTaken
				if (extraSpace < 0) throw new Error('children of Column are too high for the height alloted to Column')

				// If there are any greedy children, split up the extra space between them
				if (greedyChildrenIndexes.length) {
					const greedyChildrenHeight = extraSpace / greedyChildrenIndexes.length

					for (const greedyChildIndex of greedyChildrenIndexes) childSizes[greedyChildIndex].height = greedyChildrenHeight

					extraSpace = 0
				}

				// Set the main axis positions
				const childrenMainPositions: number[] = []
				{
					const lineUpPositions = (startPos: number, distance = 0) => {
						let spaceSoFar = startPos

						for (const childSize of childSizes) {
							childrenMainPositions.push(spaceSoFar)
							spaceSoFar += childSize.height + distance
						}
					}

					if (!params.mainAxisAlignment || params.mainAxisAlignment === 'start' || !extraSpace) lineUpPositions(0)
					else if (params.mainAxisAlignment === 'end') lineUpPositions(extraSpace)
					else if (params.mainAxisAlignment === 'center') lineUpPositions(extraSpace / 2)
					else {
						const spaceAround = params.mainAxisAlignment === 'space-around'
						const numberOfDistances = spaceAround ? childSizes.length + 1 : childSizes.length - 1
						const distance = extraSpace / numberOfDistances
						const startPos = spaceAround ? distance : 0

						lineUpPositions(startPos, distance)
					}
				}

				// Set the cross axis positions
				const childrenCrossPositions: number[] = []
				for (const childSize of childSizes) {
					if (!params.crossAxisAlignment || params.crossAxisAlignment === 'stretch' || params.crossAxisAlignment === 'start')
						childrenCrossPositions.push(0)
					else if (params.crossAxisAlignment === 'end') childrenCrossPositions.push(layout.width - childSize.width)
					else childrenCrossPositions.push((layout.width - childSize.width) / 2)
				}

				// Mount the children
				for (const childIndex in params.children) {
					const child = params.children[childIndex]
					const childSize = childSizes[childIndex]
					const childMainPos = childrenMainPositions[childIndex]
					const childCrossPos = childrenCrossPositions[childIndex]

					await mountChild(child, {
						width: childSize.width,
						height: childSize.height,
						x: childCrossPos,
						y: childMainPos,
					})
				}
			},
			preferredSize: { width: preferredWidth, height: preferredHeight },
		}
	})
}

function sumPreferredHeights(preferredSizes: Size[]) {
	let start = 0

	for (const size of preferredSizes) {
		if (size.height === null) return null

		start += size.height
	}

	return start
}

function maxPreferredWidth(preferredSizes: Size[]) {
	let max = 0

	for (const size of preferredSizes) {
		if (size.width === null) return null

		if (size.width > max) max = size.width
	}

	return max
}
