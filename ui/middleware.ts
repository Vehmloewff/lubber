import { BareInternalMiddleware, makeComponent } from './component.ts'
import { storable } from './deps.ts'
import { Component, ComponentInternals } from './mod.ts'

export interface MakeMiddlewareAttacherParams {
	useElement?(element: HTMLElement): void
	mount?(): void
	mounted?(): void
	destroy?(): Promise<void>
	destroyed?(): void
}

export function makeMiddlewareAttacher(params: MakeMiddlewareAttacherParams) {
	return (internals: ComponentInternals): ComponentInternals => {
		return {
			async destroy() {
				if (params.destroy) await params.destroy()

				await internals.destroy()
			},
			destroyed() {
				if (params.destroyed) params.destroyed()

				internals.destroyed()
			},
			mounted() {
				if (params.mounted) params.mounted()

				internals.mounted()
			},
			mount() {
				if (params.mount) params.mount()

				const element = internals.mount()
				if (params.useElement) params.useElement(element)

				return element
			},
		}
	}
}

export interface LifecycleListenersParams {
	onMount?(): unknown
	onMounted?(): unknown
	onDestroyed?(): unknown
	onDestroy?(): Promise<unknown> | unknown
}

export class LifecycleListeners {
	#listeners: LifecycleListenersParams

	constructor(listeners: LifecycleListenersParams) {
		this.#listeners = listeners
	}

	attach(internals: ComponentInternals) {
		return makeMiddlewareAttacher({
			mount: () => {
				if (this.#listeners.onMount) this.#listeners.onMount()
			},
			mounted: () => {
				if (this.#listeners.onMounted) this.#listeners.onMounted()
			},
			destroy: async () => {
				if (this.#listeners.onDestroy) await this.#listeners.onDestroy()
			},
			destroyed: () => {
				if (this.#listeners.onDestroyed) this.#listeners.onDestroyed()
			},
		})(internals)
	}
}

export function makeElementUser(fn: (element: HTMLElement) => unknown) {
	let stashedElement: HTMLElement | null = null

	return {
		attach: makeMiddlewareAttacher({
			useElement(element) {
				stashedElement = element
				fn(element)
			},
		}),
		reuse() {
			if (stashedElement) fn(stashedElement)
		},
	}
}

export function makeElementGetter() {
	let stashedElement: HTMLElement | null = null

	const user = makeElementUser((element) => {
		stashedElement = element
	})

	return {
		attach: user.attach,
		get() {
			if (!stashedElement) throw new Error('Cannot get element before component has mounted')

			return stashedElement
		},
	}
}

export interface ElementListenerFns {
	onMouseDown?(event: MouseEvent): unknown
	onMouseUp?(event: MouseEvent): unknown
	onMouseEnter?(event: MouseEvent): unknown
	onMouseLeave?(event: MouseEvent): unknown
	onHoverStart?(): unknown
	onHoverEnd?(): unknown
	onHovering?(isHovering: boolean): unknown
	onPressStart?(): unknown
	onPressEnd?(): unknown
	onPressing?(isPressing: boolean): unknown
	onPressed?(): unknown
}

export class ElementListeners {
	mouseIsDown = false
	mouseIsOver = false

	#listeners: ElementListenerFns

	constructor(listeners: ElementListenerFns) {
		this.#listeners = listeners
	}

	attach = makeElementUser((element) => {
		element.addEventListener('mousedown', (event) => {
			if (this.#listeners.onMouseDown) this.#listeners.onMouseDown(event)
			if (this.#listeners.onPressStart && !this.mouseIsDown) this.#listeners.onPressStart()
			if (this.#listeners.onPressing && !this.mouseIsDown) this.#listeners.onPressing(true)

			this.mouseIsDown = true
		})

		element.addEventListener('mouseup', (event) => {
			if (this.#listeners.onMouseUp) this.#listeners.onMouseUp(event)
			if (this.#listeners.onPressEnd && this.mouseIsDown) this.#listeners.onPressEnd()
			if (this.#listeners.onPressed && this.mouseIsDown) this.#listeners.onPressed()
			if (this.#listeners.onPressing && this.mouseIsDown) this.#listeners.onPressing(false)

			this.mouseIsDown = false
		})

		element.addEventListener('mouseenter', (event) => {
			if (this.#listeners.onMouseEnter) this.#listeners.onMouseEnter(event)
			if (this.#listeners.onHoverStart && !this.mouseIsOver) this.#listeners.onHoverStart()
			if (this.#listeners.onHovering && !this.mouseIsOver) this.#listeners.onHovering(true)

			this.mouseIsOver = true
		})

		element.addEventListener('mouseleave', (event) => {
			if (this.#listeners.onMouseLeave) this.#listeners.onMouseLeave(event)
			if (this.#listeners.onHoverEnd && this.mouseIsOver) this.#listeners.onHoverEnd()
			if (this.#listeners.onHovering && this.mouseIsOver) this.#listeners.onHovering(false)

			this.mouseIsOver = false
		})
	}).attach
}

export type StyleFn = (style: CSSStyleDeclaration) => unknown

export class Styler {
	style: CSSStyleDeclaration | null = null
	#styleFn: StyleFn

	constructor(fn: StyleFn) {
		this.#styleFn = fn
	}

	restyle() {
		if (this.style) this.#styleFn(this.style)
	}

	attach(internals: ComponentInternals) {
		return makeElementUser((element) => {
			this.style = element.style
			this.#styleFn(element.style)
		}).attach(internals)
	}
}

export interface Generics<CT> {
	removeChild: (index: number) => Promise<CT>
	insertChild: (index: number, component: CT) => void
	push: (...children: CT[]) => void
	pop: () => Promise<CT | null>
	shift: () => Promise<CT | null>
	unshift: (...children: CT[]) => void
	splice: (startIndex: number, removeCount: number, ...newChildren: CT[]) => Promise<CT[]>
	attach: (internals: ComponentInternals) => ComponentInternals
	children: CT[]
	childrenElements: HTMLElement[]
}

export function makeGenerics<CT extends Component>(): Generics<CT> {
	let stashedElement: HTMLElement | null = null

	const children: CT[] = []
	const childrenElements: HTMLElement[] = []

	async function removeChild(index: number): Promise<CT> {
		if (!children[index]) throw new Error(`A child at index ${index} does not exist`)

		if (stashedElement) {
			const child = children[index]
			const childElement = childrenElements[index]
			await child.$.destroy()

			stashedElement.removeChild(childElement)
			childrenElements.splice(index, 1)

			child.$.destroyed()
		}

		return children.splice(index, 1)[0]
	}

	function insertChild(index: number, component: CT) {
		const insertBeforeIndex = index + 1
		const insertBeforeElement = childrenElements[insertBeforeIndex]

		if (stashedElement) {
			const childElement = component.$.mount()

			stashedElement.insertBefore(childElement, insertBeforeElement || null)
			childrenElements.splice(index, 0, childElement)

			component.$.mounted()
		}

		children.splice(index, 0, component)
	}

	function push(...children: CT[]) {
		for (const child of children) insertChild(children.length, child)
	}

	async function pop() {
		if (!children.length) return null

		const lastChildIndex = children.length - 1
		return await removeChild(lastChildIndex)
	}

	function unshift(...children: CT[]) {
		for (const child of children.reverse()) insertChild(0, child)
	}

	async function shift() {
		if (!children.length) return null

		return await removeChild(0)
	}

	async function splice(startIndex: number, removeCount: number, ...newChildren: CT[]) {
		const removed: CT[] = []

		for (let i = 0; i < removeCount; i++) removed.push(await removeChild(startIndex))
		for (const child of newChildren.reverse()) insertChild(startIndex, child)

		return removed
	}

	function attach(internals: ComponentInternals) {
		return makeMiddlewareAttacher({
			useElement: (element) => {
				for (const child of children) {
					const childElement = child.$.mount()

					element.appendChild(childElement)

					childrenElements.push(childElement)
				}

				stashedElement = element
			},
			destroy: async () => {
				for (const child of children) await child.$.destroy()
			},
			destroyed: () => {
				for (const child of children) child.$.destroyed()
			},
			mounted: () => {
				for (const child of children) child.$.mounted()
			},
		})(internals)
	}

	return { removeChild, insertChild, push, pop, shift, unshift, splice, attach, children, childrenElements }
}

export class SingleChildGenerics {
	#generics = makeGenerics()

	async setChild(child: Component | null) {
		if (this.#generics.children.length) await this.#generics.removeChild(0)

		if (child) this.#generics.insertChild(0, child)
	}

	attach(internals: ComponentInternals) {
		return this.#generics.attach(internals)
	}
}

export interface WindowListenerFns {
	onResized?(): void
}

export class WindowListeners {
	#listeners: WindowListenerFns

	constructor(listeners: WindowListenerFns) {
		this.#listeners = listeners
	}

	attach(internals: ComponentInternals) {
		const resizeListener = () => {
			if (this.#listeners.onResized) this.#listeners.onResized()
		}

		globalThis.window.addEventListener('resize', resizeListener)

		const lifecycle = new LifecycleListeners({
			onDestroyed() {
				globalThis.window.removeEventListener('resize', resizeListener)
			},
		})

		return lifecycle.attach(internals)
	}
}

export function makeDimensionProvider() {
	let stashedElement: HTMLElement | null = null

	const { attach } = makeElementUser((element) => stashedElement = element)

	function getWidth() {
		if (!stashedElement) throw new Error('Cannot get width before component has mounted')

		return stashedElement.clientWidth
	}

	function getHeight() {
		if (!stashedElement) throw new Error('Cannot get height before component has mounted')

		return stashedElement.clientHeight
	}

	return { getWidth, getHeight, attach }
}

export function makeStorableListener<T>(store: storable.Storable<T>, listener: (value: T) => unknown) {
	const unsubscribe = store.subscribe(listener)

	const middleware = new LifecycleListeners({
		onDestroyed() {
			unsubscribe()
		},
	})

	return {
		attach(internals: ComponentInternals) {
			return middleware.attach(internals)
		},
	}
}

/** Presents all middleware as bare. If multiple middleware is selected, it will be presented as one. */
export function presentMiddleware(...middleware: BareInternalMiddleware[]): BareInternalMiddleware {
	return {
		attach(internals) {
			const middlewareToApply = [...middleware]

			while (middlewareToApply.length) {
				const middleware = middlewareToApply[0]
				middlewareToApply.shift()

				internals = middleware.attach(internals)
			}

			return internals
		},
	}
}
