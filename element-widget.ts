import { Size, UnknownPromiseFn, Widget, Layout } from './types.ts'
import { Context } from './context.ts'

// export interface ElementWidgetBuilderParams<T> {
// 	context: Context
// 	layout: Layout
// 	element: T
// 	registerChild(child: Widget, layout: (preferredSize: Size) => Promise<Layout>): Promise<void>
// }

// export interface ElementWidgetParams<T = HTMLElement> {
// 	elementType: string
// 	build(params: ElementWidgetBuilderParams<T>): Promise<UnknownPromiseFn>
// 	preferredSize(context: Context): Promise<Size>
// }

export interface ElementWidgetInitializeParams {
	context: Context
	getChildPreferredSize(child: Widget): Promise<Size>
}

export interface ElementWidgetInitializeMountParams<T> {
	layout: Layout
	mountChild: (child: Widget, layout: Layout) => Promise<void>
	element: T
}

export interface ElementWidgetInitializeResult<T> {
	mount(params: ElementWidgetInitializeMountParams<T>): UnknownPromiseFn | Promise<UnknownPromiseFn> | Promise<void> | void
	preferredSize: Size
}

export function elementWidget<T extends HTMLElement = HTMLElement>(
	type: string,
	initialize: (params: ElementWidgetInitializeParams) => Promise<ElementWidgetInitializeResult<T>> | ElementWidgetInitializeResult<T>
): Widget {
	let context: Context | null = null
	let destroyFn: UnknownPromiseFn | null | void = null
	let initializeResult: ElementWidgetInitializeResult<T> | null = null
	let stashedElement: T | null = null
	let mountedWidgets: Widget[] = []

	async function preferredSize(parentContext: Context): Promise<Size> {
		context = parentContext

		function getChildPreferredSize(child: Widget) {
			return child.$.preferredSize(parentContext)
		}

		initializeResult = await initialize({ context, getChildPreferredSize })

		return initializeResult.preferredSize
	}

	async function mount(parentElement: HTMLElement, layout: Layout): Promise<void> {
		if (!context || !initializeResult) throw new Error('something went wacky')

		const element = document.createElement(type) as T
		stashedElement = element

		async function mountChild(child: Widget, layout: Layout) {
			if (!context) throw new Error('something went wacky')

			await child.$.mount(element, layout)
			mountedWidgets.push(child)
		}

		destroyFn = await initializeResult.mount({ element, layout, mountChild })
		parentElement.appendChild(element)
	}

	async function destroy(): Promise<void> {
		if (destroyFn) await destroyFn()

		for (const mountedChild of mountedWidgets) await mountedChild.$.destroy()

		if (!stashedElement) throw new Error('something wrong happened')
		stashedElement.remove()

		context = null
		destroyFn = null
		initializeResult = null
		stashedElement = null
	}

	return { $: { preferredSize, mount, destroy } }
}

// Context is never cloned - parent context is set and used
// export function elementWidget<T extends HTMLElement = HTMLElement>(params: ElementWidgetParams<T>): Widget {
// 	let context: Context | null = null
// 	let destroyFn: UnknownPromiseFn | null = null

// 	function preferredSize(parentContext: Context): Promise<Size> {
// 		context = parentContext

// 		return params.preferredSize(parentContext)
// 	}

// 	async function mount(parentElement: HTMLElement, layout: Layout): Promise<void> {
// 		if (!context) throw new Error('something went wacky')

// 		const element = document.createElement(params.elementType) as T

// 		async function registerChild(child: Widget, layout: (preferredSize: Size) => Promise<Layout>) {
// 			if (!context) throw new Error('something went wacky')
// 			const preferredSize = await child.$.preferredSize(context)

// 			await child.$.mount(element, await layout(preferredSize))
// 		}

// 		destroyFn = await params.build({ context, element, layout, registerChild })
// 		parentElement.appendChild(element)
// 	}

// 	async function destroy(): Promise<void> {
// 		if (!destroyFn) throw new Error('something wrong happened')

// 		await destroyFn()
// 	}

// 	return { $: { preferredSize, mount, destroy } }
// }
