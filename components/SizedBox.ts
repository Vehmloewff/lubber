import { Widget, Size } from '../mod.ts'
import { elementWidget } from '../element-widget.ts'
import { setPosition } from '../utils.ts'

export interface SizedBoxParams {
	width?: number
	maxWidth?: number
	height?: number
	maxHeight?: number
	child?: Widget
}

export function SizedBox(params: SizedBoxParams = {}) {
	return elementWidget('div', async ({ getChildPreferredSize }) => {
		const childPreferredSize: Size = params.child ? await getChildPreferredSize(params.child) : { width: null, height: null }
		const preferredSize: Size = {
			width: getWidth(params, childPreferredSize.width),
			height: getHeight(params, childPreferredSize.height),
		}

		return {
			async mount({ element, layout, mountChild }) {
				setPosition(element, layout)

				if (params.child)
					await mountChild(params.child, {
						width: childPreferredSize.width ?? layout.width,
						height: childPreferredSize.height ?? layout.height,
						x: 0,
						y: 0,
					})
			},
			preferredSize,
		}
	})
}

function getWidth(params: SizedBoxParams, childPreferredWidth: null | number) {
	if (params.width) {
		return params.width
	}

	if (params.maxWidth) {
		if (childPreferredWidth === null) return params.maxWidth
		if (childPreferredWidth > params.maxWidth) return params.maxWidth

		return childPreferredWidth
	}

	if (childPreferredWidth) return childPreferredWidth

	return null
}

function getHeight(params: SizedBoxParams, childPreferredHeight: null | number) {
	if (params.height) {
		return params.height
	}

	if (params.maxHeight) {
		if (childPreferredHeight === null) return params.maxHeight
		if (childPreferredHeight > params.maxHeight) return params.maxHeight

		return childPreferredHeight
	}

	if (childPreferredHeight) return childPreferredHeight

	return null
}
