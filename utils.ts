/// <reference lib="dom" />

import { Layout, Widget, Size } from './types.ts'
import { ElementWidgetInitializeMountParams, ElementWidgetInitializeParams } from './element-widget.ts'

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function setPosition(element: HTMLElement, layout: Layout) {
	element.style.position = 'absolute'

	element.style.width = `${layout.width}px`
	element.style.height = `${layout.height}px`

	element.style.left = `${layout.x}px`
	element.style.top = `${layout.y}px`
}

export interface CarelessMounterResult {
	carelessMountChild(mountChild: ElementWidgetInitializeMountParams<HTMLElement>['mountChild'], layout: Layout): Promise<void>
	preferredSize: Size
}

export async function carelessMounter(
	getChildPreferredSize: ElementWidgetInitializeParams['getChildPreferredSize'],
	child?: Widget
): Promise<CarelessMounterResult> {
	if (!child) {
		return {
			carelessMountChild() {
				return Promise.resolve()
			},
			preferredSize: { width: null, height: null },
		}
	}

	const childPreferredSize = await getChildPreferredSize(child)

	async function carelessMountChild(mountChild: ElementWidgetInitializeMountParams<HTMLElement>['mountChild'], layout: Layout) {
		if (!child) throw new Error('something went wrong')

		await mountChild(child, {
			width:
				childPreferredSize.width !== null
					? childPreferredSize.width <= layout.width
						? childPreferredSize.width
						: layout.width
					: layout.width,
			height:
				childPreferredSize.height !== null
					? childPreferredSize.height <= layout.height
						? childPreferredSize.height
						: layout.height
					: layout.height,
			x: layout.x,
			y: layout.y,
		})
	}

	return {
		carelessMountChild,
		preferredSize: childPreferredSize,
	}
}

export function repeat(text: string, number: number) {
	let newText = ''

	for (let i = 1; i <= number; i++) newText += text

	return newText
}
