import { Size, UnknownPromiseFn, Widget, Layout, PartialLayout } from './types.ts'
import { Context } from './context.ts'
import { setThisParentXY } from './utils.ts'

export interface ElementWidgetInitializeParams {
	context: Context
	getChildPreferredSize(child: Widget): Promise<Size>
}

export interface ElementWidgetInitializeMountParams<T> {
	layout: Layout
	mountChild: (child: Widget, partialLayout: PartialLayout) => Promise<void>
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
	const mountedWidgets: Widget[] = []

	async function preferredSize(parentContext: Context): Promise<Size> {
		context = parentContext

		function getChildPreferredSize(child: Widget) {
			return child.$.preferredSize(parentContext)
		}

		initializeResult = await initialize({ context, getChildPreferredSize })

		return initializeResult.preferredSize
	}

	async function mount(parentElement: HTMLElement, parentLayout: Layout): Promise<void> {
		if (!context || !initializeResult) throw new Error('something went wacky')

		const element = document.createElement(type) as T
		stashedElement = element

		async function mountChild(child: Widget, layout: PartialLayout) {
			if (!context) throw new Error('something went wacky')

			await child.$.mount(element, { ...layout, ...setThisParentXY(parentLayout) })
			mountedWidgets.push(child)
		}

		destroyFn = await initializeResult.mount({ element, layout: parentLayout, mountChild })
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
