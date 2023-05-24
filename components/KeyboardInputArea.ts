// TODO update
//
// // import { createEmitter, useLifecycle } from '../render.ts'
// import { SingleChildBlock } from './mod.ts'

// export class KeyboardInputArea {
// 	#changeEmitter = createEmitter<string>()
// 	#focusEmitter = createEmitter()
// 	#blurEmitter = createEmitter()
// 	#lifecycle = useLifecycle()
// 	#view = new SingleChildBlock()
// 	#inputElement = document.createElement('textarea')

// 	$ = this.#view.$
// 		.connect(this.#lifecycle)

// 	#currentAllowNewlines = false

// 	constructor() {
// 		this.#inputElement.style.width = '100%'
// 		this.#inputElement.style.height = '100%'
// 		this.#inputElement.style.outline = 'none'
// 		this.#inputElement.style.padding = '0'
// 		this.#inputElement.style.border = 'none'
// 		this.#inputElement.style.background = 'rgba(0, 0, 0, 0)'
// 		this.#inputElement.style.resize = 'none'

// 		this.#turnWrappingOff()

// 		this.#inputElement.addEventListener('keydown', (event) => {
// 			if (event.key === 'Enter' || event.key === 'Return') {
// 				if (!this.#currentAllowNewlines) event.preventDefault()
// 			}
// 		})

// 		this.#inputElement.addEventListener('change', () => {
// 			this.#changeEmitter.fire(this.#inputElement.value)
// 		})

// 		this.#inputElement.addEventListener('focus', () => {
// 			this.#focusEmitter.fire()
// 		})

// 		this.#inputElement.addEventListener('blur', () => {
// 			this.#blurEmitter.fire()
// 		})

// 		this.#lifecycle.onMount(() => {
// 			this.$.element.appendChild(this.#inputElement)
// 		})
// 	}

// 	allowNewlines(allowNewlines = true) {
// 		this.#currentAllowNewlines = allowNewlines

// 		return this
// 	}

// 	#turnWrappingOff() {
// 		this.#inputElement.style.whiteSpace = 'pre'
// 	}

// 	#turnWrappingOn() {
// 		this.#inputElement.style.whiteSpace = 'pre-wrap'
// 	}

// 	allowWrapping(allowWrapping = true) {
// 		if (allowWrapping) this.#turnWrappingOn()
// 		else this.#turnWrappingOff()

// 		return this
// 	}

// 	onChange(fn: (value: string) => unknown) {
// 		this.#changeEmitter.on(fn)

// 		return this
// 	}

// 	onBlur(fn: () => unknown) {
// 		this.#blurEmitter.on(fn)

// 		return this
// 	}

// 	onFocus(fn: () => unknown) {
// 		this.#focusEmitter.on(fn)

// 		return this
// 	}

// 	value(value: string) {
// 		this.#inputElement.value = value

// 		return this
// 	}

// 	focus() {
// 		this.#inputElement.focus()

// 		return this
// 	}

// 	blur() {
// 		this.#inputElement.blur()

// 		return this
// 	}
// }
