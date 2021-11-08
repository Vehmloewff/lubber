import { Widget } from '../mod.ts'
import { elementWidget } from '../element-widget.ts'
import { setPosition } from '../utils.ts'

export interface CenterParams {
	child: Widget
}

export function Center(params: CenterParams) {
	return elementWidget('div', ({ getChildPreferredSize }) => ({
		async mount({ layout, mountChild, element }) {
			setPosition(element, layout)

			const childPreferredSize = await getChildPreferredSize(params.child)
			const childWidth = childPreferredSize.width ?? layout.width
			const childHeight = childPreferredSize.height ?? layout.height

			await mountChild(params.child, {
				width: childWidth,
				height: childHeight,
				x: (layout.width - childWidth) / 2,
				y: (layout.height - childHeight) / 2,
			})
		},
		preferredSize: { width: null, height: null },
	}))
}
