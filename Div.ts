import { Component } from './mod.ts'

export interface DivParams {
	style?: Partial<CSSStyleDeclaration>
	children?: Component[]
	on?: Partial<EventHandlers>
}

export interface EventHandlers {
	abort: (eventData: UIEvent) => unknown
	animationcancel: (eventData: AnimationEvent) => unknown
	animationend: (eventData: AnimationEvent) => unknown
	animationiteration: (eventData: AnimationEvent) => unknown
	animationstart: (eventData: AnimationEvent) => unknown
	auxclick: (eventData: MouseEvent) => unknown
	beforeinput: (eventData: InputEvent) => unknown
	blur: (eventData: FocusEvent) => unknown
	canplay: (eventData: Event) => unknown
	canplaythrough: (eventData: Event) => unknown
	change: (eventData: Event) => unknown
	click: (eventData: MouseEvent) => unknown
	close: (eventData: Event) => unknown
	compositionend: (eventData: CompositionEvent) => unknown
	compositionstart: (eventData: CompositionEvent) => unknown
	compositionupdate: (eventData: CompositionEvent) => unknown
	contextmenu: (eventData: MouseEvent) => unknown
	cuechange: (eventData: Event) => unknown
	dblclick: (eventData: MouseEvent) => unknown
	drag: (eventData: DragEvent) => unknown
	dragend: (eventData: DragEvent) => unknown
	dragenter: (eventData: DragEvent) => unknown
	dragleave: (eventData: DragEvent) => unknown
	dragover: (eventData: DragEvent) => unknown
	dragstart: (eventData: DragEvent) => unknown
	drop: (eventData: DragEvent) => unknown
	durationchange: (eventData: Event) => unknown
	emptied: (eventData: Event) => unknown
	ended: (eventData: Event) => unknown
	error: (eventData: ErrorEvent) => unknown
	focus: (eventData: FocusEvent) => unknown
	focusin: (eventData: FocusEvent) => unknown
	focusout: (eventData: FocusEvent) => unknown
	formdata: (eventData: FormDataEvent) => unknown
	gotpointercapture: (eventData: PointerEvent) => unknown
	input: (eventData: Event) => unknown
	invalid: (eventData: Event) => unknown
	keydown: (eventData: KeyboardEvent) => unknown
	keypress: (eventData: KeyboardEvent) => unknown
	keyup: (eventData: KeyboardEvent) => unknown
	load: (eventData: Event) => unknown
	loadeddata: (eventData: Event) => unknown
	loadedmetadata: (eventData: Event) => unknown
	loadstart: (eventData: Event) => unknown
	lostpointercapture: (eventData: PointerEvent) => unknown
	mousedown: (eventData: MouseEvent) => unknown
	mouseenter: (eventData: MouseEvent) => unknown
	mouseleave: (eventData: MouseEvent) => unknown
	mousemove: (eventData: MouseEvent) => unknown
	mouseout: (eventData: MouseEvent) => unknown
	mouseover: (eventData: MouseEvent) => unknown
	mouseup: (eventData: MouseEvent) => unknown
	pause: (eventData: Event) => unknown
	play: (eventData: Event) => unknown
	playing: (eventData: Event) => unknown
	pointercancel: (eventData: PointerEvent) => unknown
	pointerdown: (eventData: PointerEvent) => unknown
	pointerenter: (eventData: PointerEvent) => unknown
	pointerleave: (eventData: PointerEvent) => unknown
	pointermove: (eventData: PointerEvent) => unknown
	pointerout: (eventData: PointerEvent) => unknown
	pointerover: (eventData: PointerEvent) => unknown
	pointerup: (eventData: PointerEvent) => unknown
	progress: (eventData: ProgressEvent) => unknown
	ratechange: (eventData: Event) => unknown
	reset: (eventData: Event) => unknown
	resize: (eventData: UIEvent) => unknown
	scroll: (eventData: Event) => unknown
	securitypolicyviolation: (eventData: SecurityPolicyViolationEvent) => unknown
	seeked: (eventData: Event) => unknown
	seeking: (eventData: Event) => unknown
	select: (eventData: Event) => unknown
	selectionchange: (eventData: Event) => unknown
	selectstart: (eventData: Event) => unknown
	stalled: (eventData: Event) => unknown
	submit: (eventData: Event) => unknown
	suspend: (eventData: Event) => unknown
	timeupdate: (eventData: Event) => unknown
	toggle: (eventData: Event) => unknown
	touchcancel: (eventData: TouchEvent) => unknown
	touchend: (eventData: TouchEvent) => unknown
	touchmove: (eventData: TouchEvent) => unknown
	touchstart: (eventData: TouchEvent) => unknown
	transitioncancel: (eventData: TransitionEvent) => unknown
	transitionend: (eventData: TransitionEvent) => unknown
	transitionrun: (eventData: TransitionEvent) => unknown
	transitionstart: (eventData: TransitionEvent) => unknown
	volumechange: (eventData: Event) => unknown
	waiting: (eventData: Event) => unknown
	webkitanimationend: (eventData: Event) => unknown
	webkitanimationiteration: (eventData: Event) => unknown
	webkitanimationstart: (eventData: Event) => unknown
	webkittransitionend: (eventData: Event) => unknown
	wheel: (eventData: WheelEvent) => unknown
	copy: (eventData: ClipboardEvent) => unknown
	cut: (eventData: ClipboardEvent) => unknown
	paste: (eventData: ClipboardEvent) => unknown
	fullscreenchange: (eventData: Event) => unknown
	fullscreenerror: (eventData: Event) => unknown
}

export function Div(params: DivParams): Component {
	let stashedEl: HTMLDivElement | null = null

	return {
		$: {
			async mount(el) {
				const div = document.createElement('div')
				stashedEl = div

				if (params.on)
					for (const eventName in params.on) {
						const value = params.on[eventName as keyof EventHandlers]

						// @ts-ignore params don't line up correctly for some reason
						if (value) div.addEventListener(eventName, value)
					}

				if (params.style)
					for (const key in params.style) {
						const value = params.style[key]

						if (value) div.style[key] = value
					}

				el.appendChild(div)

				if (params.children)
					for (const child of params.children) {
						await child.$.mount(div)
					}
			},
			async destroy() {
				if (!stashedEl) throw new Error('destroy was called before mount')

				if (params.on)
					for (const eventName in params.on) {
						const value = params.on[eventName as keyof EventHandlers]

						// @ts-ignore params don't line up correctly for some reason
						stashedEl.removeEventListener(eventName, value)
					}

				if (params.children)
					for (const child of params.children) {
						await child.$.destroy()
					}

				stashedEl?.remove()
			},
		},
	}
}
