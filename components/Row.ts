import { Size, FlexSystemParams, FixedSize } from '../mod.ts'
import { elementWidget } from '../element-widget.ts'
import { setPosition } from '../utils.ts'

export function Row(params: FlexSystemParams) {
	return elementWidget('div', async ({ getChildPreferredSize }) => {
		const childrenPreferredSizes: Size[] = []

		for (const child of params.children) {
			childrenPreferredSizes.push(await getChildPreferredSize(child))
		}

		const preferredWidth = params.collapseMainAxis ? sumPreferredWidths(childrenPreferredSizes) : null
		const preferredHeight = params.collapseCrossAxis ? maxPreferredHeight(childrenPreferredSizes) : null

		return {
			async mount({ layout, mountChild, element }) {
				setPosition(element, layout)

				let spaceTaken = 0
				const childSizes: FixedSize[] = []
				const greedyChildrenIndexes: number[] = []

				// set the child sizes
				// greedy children (those with preferredWidth === null) are set to width = 0
				for (const childPreferredSize of childrenPreferredSizes) {
					if (childPreferredSize.width === null) greedyChildrenIndexes.push(childSizes.length)
					else spaceTaken += childPreferredSize.width

					childSizes.push({
						height: params.crossAxisAlignment === 'stretch' ? layout.height : childPreferredSize.height ?? layout.height,
						width: childPreferredSize.width ?? 0,
					})
				}

				let extraSpace = layout.width - spaceTaken
				if (extraSpace < 0) throw new Error('children of Row are too wide for the width alloted to Row')

				// If there are any greedy children, split up the extra space between them
				if (greedyChildrenIndexes.length) {
					const greedyChildrenWidth = extraSpace / greedyChildrenIndexes.length

					for (const greedyChildIndex of greedyChildrenIndexes) childSizes[greedyChildIndex].width = greedyChildrenWidth

					extraSpace = 0
				}

				// Set the main axis positions
				const childrenMainPositions: number[] = []
				{
					const lineUpPositions = (startPos: number, distance = 0) => {
						let spaceSoFar = startPos

						for (const childSize of childSizes) {
							childrenMainPositions.push(spaceSoFar)
							spaceSoFar += childSize.width + distance
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
					if (params.crossAxisAlignment === 'stretch' || params.crossAxisAlignment === 'start') childrenCrossPositions.push(0)
					else if (params.crossAxisAlignment === 'end') childrenCrossPositions.push(layout.height - childSize.height)
					else childrenCrossPositions.push((layout.height - childSize.height) / 2)
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
						x: childMainPos,
						y: childCrossPos,
					})
				}
			},
			preferredSize: { width: preferredWidth, height: preferredHeight },
		}
	})
}

function sumPreferredWidths(preferredSizes: Size[]) {
	let start = 0

	for (const size of preferredSizes) {
		if (size.width === null) return null

		start += size.width
	}

	return start
}

function maxPreferredHeight(preferredSizes: Size[]) {
	let max = 0

	for (const size of preferredSizes) {
		if (size.height === null) return null

		if (size.height > max) max = size.height
	}

	return max
}
