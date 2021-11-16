import { Widget, BoxSides } from '../mod.ts'
import { elementWidget } from '../element-widget.ts'
import { carelessMounter } from '../utils.ts'

export interface PaddingParams {
	child?: Widget
	padding?: number | Partial<BoxSides<number>>
}

const getSumX = (box: Partial<BoxSides<number>> | number | undefined) => {
	if (box === undefined) return 0

	if (typeof box === 'number') return box * 2

	return (box.left ?? 0) + (box.right ?? 0)
}

const getSumY = (box: Partial<BoxSides<number>> | number | undefined) => {
	if (box === undefined) return 0

	if (typeof box === 'number') return box * 2

	return (box.top ?? 0) + (box.bottom ?? 0)
}

export function Padding(params: PaddingParams = {}) {
	return elementWidget('div', async ({ getChildPreferredSize }) => {
		const { carelessMountChild, preferredSize } = await carelessMounter(getChildPreferredSize, params.child)
		const sumX = getSumX(params.padding)
		const sumY = getSumY(params.padding)

		return {
			mount({ mountChild, layout }) {
				const padding = params.padding ?? 0

				return carelessMountChild(mountChild, {
					x: layout.x + (typeof padding === 'number' ? padding : padding.left ?? 0),
					y: layout.y + (typeof padding === 'number' ? padding : padding.top ?? 0),
					width: layout.width - sumX,
					height: layout.height - sumY,
					parentXInViewport: layout.parentXInViewport,
					parentYInViewport: layout.parentYInViewport,
				})
			},
			preferredSize: {
				width: preferredSize.width !== null ? preferredSize.width + sumX : null,
				height: preferredSize.height !== null ? preferredSize.height + sumY : null,
			},
		}
	})
}
