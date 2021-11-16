import { Widget } from '../mod.ts'
import { elementWidget } from '../element-widget.ts'
import { carelessMounter, setPosition } from '../utils.ts'

export interface DisablePressEventsParams {
	child: Widget
}

export function DisablePressEvents(params: DisablePressEventsParams) {
	return elementWidget('div', async ({ getChildPreferredSize }) => {
		const { carelessMountChild, preferredSize } = await carelessMounter(getChildPreferredSize, params.child)

		return {
			async mount({ element, layout, mountChild }) {
				setPosition(element, layout)

				element.style.pointerEvents = 'none'

				await carelessMountChild(mountChild, layout)
			},
			preferredSize,
		}
	})
}
