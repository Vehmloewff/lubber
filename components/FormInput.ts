// TODO update
//
// import { Column } from './Flex.ts'
// import { Label } from './Label.ts'

// export class FormField {
// 	#changeEmitter = createEmitter<string>()

// 	#label = new Label()
// 		.fontSize(14)
// 		.bold()
// 		.color(setAlpha('black', 0.3))

// 	#view = new Column()
// 		.gap(2)
// 		.child(this.#label)

// 	$ = this.#view.$

// 	#currentLabel = 'Label'

// 	constructor() {
// 		this.#label.text(this.#currentLabel)
// 	}

// 	label(label: string) {
// 		this.#label.text(label)

// 		return this
// 	}

// 	field(field: Component) {
// 		this.#view.child(field)

// 		return this
// 	}

// 	onChange(fn: (value: string) => unknown) {
// 		this.#changeEmitter.on(fn)

// 		return this
// 	}
// }
