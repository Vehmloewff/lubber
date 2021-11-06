/// <reference lib="dom" />

import { makeContext, Context } from './context.ts'

export interface Component {
	$: ComponentInternals
}

export interface Layout extends Size {
	x: number
	y: number
}

export interface Size {
	width: number | null
	height: number | null
}

// The component mount process looks like this:
// - First, `preferredSize` is called.  It builds a template, determining the child component
// the child components `preferredSize` function is called and the result returned.
// - Second, `mount` is called.
// - When the component is destroyed, `destroy` is called.
export interface ComponentInternals {
	preferredSize(parentContext: Context): Promise<Size>
	mount(parentElement: HTMLElement, layout: Layout): Promise<void>
	destroy(): Promise<void>
}

export interface MakeComponentParams {
	onDestroy(): Promise<void>
	beforeMount(): Promise<void>
	afterMount(): Promise<void>
}

export type MakeComponentResult = (
	context: Context,
	builder: (context: Context) => Promise<Component>
) => Promise<{
	mount(parentElement: HTMLElement, layout: Layout): Promise<() => Promise<void>>
	preferredSize: Size
}>

export function makeComponent(params: MakeComponentParams): MakeComponentResult {
	return async (parentContext, builder) => {
		const thisContext = makeContext(parentContext)
		let childComponent = await builder(thisContext)
		const preferredSize: Size = await childComponent.$.preferredSize(thisContext)

		async function mount(parentElement: HTMLElement, layout: Layout) {
			await params.beforeMount()

			await childComponent.$.mount(parentElement, layout)

			params.afterMount()

			return async () => {
				await childComponent.$.destroy()
				childComponent = await builder(thisContext)
			}
		}

		return { mount, preferredSize }
	}
}

// export function lubber() {
// 	function setState() {}

// 	const $: ComponentInternals = {
// 		async initialize() {
// 			return {
// 				mount() {},
// 				preferredSize: {},
// 			}
// 		},
// 		destroy() {}
// 	}

// 	return {}
// }

// export function lubber() {
// 	let thisContext: Context | null = null
// 	let stashedTemplate: null | ((context: Context) => Component) = null
// 	let stashedParentElement: null | HTMLElement = null
// 	let stashedDestroyHook: null | (() => Promise<void>) = null
// 	let stashedLayout: null | Layout = null

// 	let preStashedTemplateResult: null | Component = null

// 	const runTemplate = (templateMaker: () => Component) => {
// 		if (preStashedTemplateResult) {
// 			const p = preStashedTemplateResult
// 			preStashedTemplateResult = null
// 			return p
// 		}

// 		return templateMaker()
// 	}

// 	const render = async () => {
// 		if (!stashedParentElement || !thisContext || !stashedLayout) return console.warn('setState was called before component was mounted')
// 		if (!stashedTemplate) return console.warn('"template" was not called or called too late')

// 		const temp = runTemplate(() => {
// 			if (!stashedTemplate || !thisContext) throw new Error('something wrong happened')

// 			return stashedTemplate(thisContext)
// 		})

// 		await temp.$.mount(stashedParentElement, stashedLayout, thisContext)

// 		stashedDestroyHook = temp.$.destroy
// 	}

// 	function template(tmp: (context: Context) => Component) {
// 		if (stashedTemplate) throw new Error('"template" can only be called once per component')
// 		stashedTemplate = tmp
// 	}

// 	async function setState(cb: () => Promise<unknown> | unknown) {
// 		await cb()

// 		if (!stashedDestroyHook) return console.warn('setState was called before "template"')

// 		await stashedDestroyHook()
// 		await render()
// 	}

// 	let userDefinedStashedDestroyHook: null | (() => Promise<void>) = null
// 	function onDestroy(cb: () => Promise<unknown> | unknown) {
// 		userDefinedStashedDestroyHook = async () => {
// 			await cb()
// 		}
// 	}

// 	let userDefinedStashedAfterMountHook: null | (() => unknown) = null
// 	function afterMount(fn: () => unknown) {
// 		userDefinedStashedAfterMountHook = fn
// 	}

// 	let userDefinedStashedBeforeMountHook: null | (() => Promise<void>) = null
// 	function beforeMount(fn: () => Promise<unknown> | unknown) {
// 		userDefinedStashedBeforeMountHook = async () => {
// 			await fn()
// 		}
// 	}

// 	const $: ComponentInternals = {
// 		async mount(parentElement, layout) {
// 			if (userDefinedStashedBeforeMountHook) await userDefinedStashedBeforeMountHook()

// 			stashedParentElement = parentElement
// 			stashedLayout = layout

// 			await render()

// 			if (userDefinedStashedAfterMountHook) userDefinedStashedAfterMountHook()
// 		},
// 		async destroy() {
// 			if (userDefinedStashedDestroyHook) await userDefinedStashedDestroyHook()
// 		},
// 		preferredSize(parentContext) {
// 			if (!stashedTemplate) throw new Error('"template" was not called')

// 			thisContext = makeContext(parentContext)
// 			preStashedTemplateResult = stashedTemplate(thisContext)

// 			return preStashedTemplateResult.$.preferredSize(thisContext)
// 		},
// 	}

// 	return { template, $, setState, onDestroy, beforeMount, afterMount }
// }

// export async function render(rootComponent: Component, rootElement = document.body) {
// 	const context = makeContext()

// 	rootElement.style.position = 'fixed'
// 	rootElement.style.top = '0'
// 	rootElement.style.right = '0'
// 	rootElement.style.bottom = '0'
// 	rootElement.style.left = '0'
// 	rootElement.style.margin = '0'
// 	rootElement.style.padding = '0'

// 	const rootLayout: Layout = {
// 		x: 0,
// 		y: 0,
// 		width: rootElement.clientWidth,
// 		height: rootElement.clientHeight,
// 	}

// 	await rootComponent.$.preferredSize(context)
// 	await rootComponent.$.mount(rootElement, rootLayout)
// }
