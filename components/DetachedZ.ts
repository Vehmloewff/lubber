import { Widget } from '../mod.ts'
import { elementWidget } from '../element-widget.ts'
import { carelessMounter } from '../utils.ts'

export interface DetachedZParams {
	child: Widget
	zIndex?: number
}

export function DetachedZ(params: DetachedZParams) {
	return elementWidget('div', async ({ getChildPreferredSize }) => {
		const { carelessMountChild, preferredSize } = await carelessMounter(getChildPreferredSize, params.child)

		return {
			mount({ element, layout, mountChild }) {
				element.style.position = 'fixed'
				element.style.left = `${layout.x + layout.parentXInViewport}px`
				element.style.top = `${layout.y + layout.parentYInViewport}px`
				element.style.width = `${layout.width}px`
				element.style.height = `${layout.height}px`

				carelessMountChild(mountChild, layout)
			},
			preferredSize,
		}
	})
}
