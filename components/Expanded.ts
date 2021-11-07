import { Widget } from '../mod.ts'
import { elementWidget } from '../element-widget.ts'

export interface ExpandedParams {
	child?: Widget
}

export function Expanded(params: ExpandedParams) {
	return elementWidget('div', ({ getChildPreferredSize }) => {
		return {
			mount({ layout, mountChild }) {},
			preferredSize: { width: null, height: null },
		}
	})
}
