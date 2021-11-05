/// <reference lib="dom" />

export interface Component {
	$: ComponentInternals
}

export interface ComponentInternals {
	mount(element: HTMLElement): Promise<void>
	destroy(): Promise<void>
}

export function gui() {
	let stashedTemplate: null | (() => Component) = null
	let stashedParentElement: null | HTMLElement = null
	let stashedDestroyHook: null | (() => Promise<void>) = null

	const render = async () => {
		if (!stashedParentElement) return console.warn('setState was called before component was mounted')
		if (!stashedTemplate) return console.warn('setState was called before "template"')

		const temp = stashedTemplate()
		await temp.$.mount(stashedParentElement)

		stashedDestroyHook = temp.$.destroy
	}

	function template(tmp: () => Component) {
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

	const $: ComponentInternals = {
		async mount(el) {
			stashedParentElement = el

			await render()
		},
		async destroy() {
			if (userDefinedStashedDestroyHook) await userDefinedStashedDestroyHook()
		},
	}

	return { template, $, setState, onDestroy }
}

export function render(rootComponent: Component) {
	rootComponent.$.mount(document.body)
}
