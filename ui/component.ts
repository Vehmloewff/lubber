export interface ComponentInternals {
	mount(): HTMLElement
	mounted(): void
	destroy(): Promise<void>
	destroyed(): void
}

export interface BareInternalMiddleware {
	attach(internals: ComponentInternals): ComponentInternals
}

export type ComponentOnStyleFn = (style: CSSStyleDeclaration) => void

export interface Component {
	$: ComponentInternals
}

/** Simply an HTML div element */
export class ElementComponent {
	htmlElement = document.createElement('div')

	$: ComponentInternals = {
		mount: () => this.htmlElement,
		mounted: () => {},
		destroy: () => Promise.resolve(),
		destroyed: () => {},
	}
}

export function makeComponent() {
	let stashedComponent: ComponentInternals | null = null
	const middlewareToApply: BareInternalMiddleware[] = []

	const $: ComponentInternals = {
		mount() {
			if (!stashedComponent) throw new Error('Element was mounted before `render` was called')

			return stashedComponent.mount()
		},
		mounted() {
			if (!stashedComponent) throw new Error('Element was mounted before `render` was called')

			return stashedComponent.mounted()
		},
		async destroy() {
			if (!stashedComponent) throw new Error('Element was destroyed before `render` was called')

			return await stashedComponent.destroy()
		},
		destroyed() {
			if (!stashedComponent) throw new Error('Element was destroyed before `render` was called')

			return stashedComponent.destroyed()
		},
	}

	function render(component: Component) {
		let updatedInternals = component.$

		while (middlewareToApply.length) {
			const middleware = middlewareToApply[0]
			middlewareToApply.shift()

			updatedInternals = middleware.attach(updatedInternals)
		}

		stashedComponent = updatedInternals
	}

	function use<T extends BareInternalMiddleware>(middleware: T) {
		if (stashedComponent) throw new Error('All middleware must be applied before `render` is called')

		middlewareToApply.push(middleware)

		return middleware
	}

	return { $, render, use }
}
