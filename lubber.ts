/// <reference lib="dom" />

import { makeContext, Context } from './context.ts'

export interface Component {
	$: ComponentInternals
}

export interface ComponentInternals {
	mount(parentElement: HTMLElement, parentContext: Context): Promise<void>
	destroy(): Promise<void>
}

export function lubber() {
	let thisContext: Context | null = null
	let stashedTemplate: null | ((context: Context) => Component) = null
	let stashedParentElement: null | HTMLElement = null
	let stashedDestroyHook: null | (() => Promise<void>) = null

	const render = async () => {
		if (!stashedParentElement || !thisContext) return console.warn('setState was called before component was mounted')
		if (!stashedTemplate) return console.warn('setState was called before "template"')

		const temp = stashedTemplate(thisContext)
		await temp.$.mount(stashedParentElement, thisContext)

		stashedDestroyHook = temp.$.destroy
	}

	function template(tmp: (context: Context) => Component) {
		if (stashedTemplate) throw new Error('"template" can only be called once per component')
		stashedTemplate = tmp
	}

	async function setState(cb: () => Promise<unknown> | unknown) {
		await cb()

		if (!stashedDestroyHook) return console.warn('setState was called before "template"')

		await stashedDestroyHook()
		await render()
	}

	let userDefinedStashedDestroyHook: null | (() => Promise<void>) = null
	function onDestroy(cb: () => Promise<unknown> | unknown) {
		userDefinedStashedDestroyHook = async () => {
			await cb()
		}
	}

	let userDefinedStashedAfterMountHook: null | (() => unknown) = null
	function afterMount(fn: () => unknown) {
		userDefinedStashedAfterMountHook = fn
	}

	let userDefinedStashedBeforeMountHook: null | (() => Promise<void>) = null
	function beforeMount(fn: () => Promise<unknown> | unknown) {
		userDefinedStashedBeforeMountHook = async () => {
			await fn()
		}
	}

	const $: ComponentInternals = {
		async mount(parentElement, parentContext) {
			if (userDefinedStashedBeforeMountHook) await userDefinedStashedBeforeMountHook()

			stashedParentElement = parentElement
			thisContext = makeContext(parentContext)

			await render()

			if (userDefinedStashedAfterMountHook) userDefinedStashedAfterMountHook()
		},
		async destroy() {
			if (userDefinedStashedDestroyHook) await userDefinedStashedDestroyHook()
		},
	}

	return { template, $, setState, onDestroy, beforeMount, afterMount }
}

export function render(rootComponent: Component) {
	rootComponent.$.mount(document.body, makeContext())
}
