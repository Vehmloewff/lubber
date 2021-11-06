import { Layout, Widget, FixedSize } from './types.ts'
import { ElementWidgetInitializeMountParams, ElementWidgetInitializeParams } from './element-widget.ts'

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function setPosition(element: HTMLElement, layout: Layout) {
	element.style.position = 'absolute'

	element.style.width = `${layout.width}px`
	element.style.height = `${layout.height}px`

	element.style.left = `${layout.x}px`
	element.style.top = `${layout.y}px`
}

export interface CarelessChildMountParams {
	mountChild: ElementWidgetInitializeMountParams<HTMLElement>['mountChild']
	getChildPreferredSize: ElementWidgetInitializeParams['getChildPreferredSize']
	layout: Layout
	child: Widget
}

export async function carelessChildMount(params: CarelessChildMountParams) {
	const childPreferredSize = await params.getChildPreferredSize(params.child)
	const childSize: FixedSize = {
		width: childPreferredSize.width
			? childPreferredSize.width >= params.layout.width
				? childPreferredSize.width
				: params.layout.width
			: params.layout.width,
		height: childPreferredSize.height
			? childPreferredSize.height >= params.layout.height
				? childPreferredSize.height
				: params.layout.height
			: params.layout.height,
	}

	const childLayout: Layout = {
		x: 0,
		y: 0,
		width: childSize.width,
		height: childSize.height,
	}

	await params.mountChild(params.child, childLayout)
}

export function repeat(text: string, number: number) {
	let newText = ''

	for (let i = 1; i <= number; i++) newText += text

	return newText
}
