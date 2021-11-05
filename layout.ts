import { Context } from './context.ts'

export interface Layout {
	spaceX: number
	spaceY: number
}

export function getLayout(context: Context) {
	return context.getKey('layout') as Layout
}

export function setLayout(context: Context, layout: Layout) {
	return context.setKey('layout', layout)
}

export function rootLayout(rootElement: HTMLElement): Layout {
	rootElement.style.position = 'fixed'
	rootElement.style.top = '0'
	rootElement.style.right = '0'
	rootElement.style.bottom = '0'
	rootElement.style.left = '0'
	rootElement.style.margin = '0'
	rootElement.style.padding = '0'

	return {
		spaceX: rootElement.clientWidth,
		spaceY: rootElement.clientHeight,
	}
}
