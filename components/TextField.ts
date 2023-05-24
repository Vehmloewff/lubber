// TODO Update
//
// import { setAlpha } from '../color.ts'
// import { KeyboardInputArea } from './KeyboardInputArea.ts'
// import { Padding } from './Padding.ts'
// import { SizedBox } from './SizedBox.ts'
// import { Container } from './mod.ts'

// export class TextField {
// 	#inputOutlet = new Padding()
// 		.paddingY(2)
// 		.paddingX(10)

// 	#container = new Container()
// 		.borderRadius(6)
// 		.border('blue', 2)
// 		.cursor('text')
// 		.child(this.#inputOutlet)

// 	#view = new SizedBox()
// 		.child(this.#container)

// 	#isFocused = false
// 	#isShowingPlaceholder = false

// 	$ = this.#view.$

// 	constructor() {
// 		this.#showPlaceholder()

// 		// TODO when container is clicked, focus input area if it is not already focused
// 	}

// 	setInput(input: KeyboardInputArea, height = 32) {
// 		this.#inputOutlet.child(
// 			input
// 				.onChange((value) => this.#handleChange(value))
// 				.onFocus(() => {
// 					this.#isFocused = true
// 					this.#applyLoudness()
// 				})
// 				.onBlur(() => {
// 					this.#isFocused = false
// 					this.#removeLoudness()
// 				}),
// 		)

// 		this.#view.height(height)

// 		return this
// 	}

// 	#removeLoudness() {
// 		this.#container.ring(null)
// 	}

// 	#applyLoudness() {
// 		this.#container.ring(setAlpha('blue', 0.3), 4)
// 	}

// 	#handleChange(value: string) {
// 		if (!value.length && !this.#isShowingPlaceholder) this.#showPlaceholder()
// 		if (value.length && this.#isShowingPlaceholder) this.#hidePlaceholder()
// 	}

// 	#showPlaceholder() {
// 		this.#isShowingPlaceholder = true

// 		// TODO show placeholder
// 	}

// 	#hidePlaceholder() {
// 		this.#isShowingPlaceholder = false

// 		// TODO show placeholder
// 	}
// }
