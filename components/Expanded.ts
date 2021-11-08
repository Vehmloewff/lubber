import { Widget } from '../mod.ts'
import { elementWidget } from '../element-widget.ts'
import { setPosition } from '../utils.ts'

export interface ExpandedParams {
	child?: Widget
}

export function Expanded(params: ExpandedParams) {
	return elementWidget('div', ({ getChildPreferredSize }) => ({
		async mount({ element, layout, mountChild }) {
			setPosition(element, layout)

			if (params.child) {
				const preferredSize = await getChildPreferredSize(params.child)
				await mountChild(params.child, {
					width: preferredSize.width ?? layout.width,
					height: preferredSize.height ?? layout.height,
					x: 0,
					y: 0,
				})
			}
		},
		preferredSize: { width: null, height: null },
	}))
}
