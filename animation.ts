import { cases } from './deps.ts'
import { delay } from './utils.ts'

export type AnimationBuilder = { duration: number; delay: number; iterations: number; makeSlice(i: number): CSSStyleDeclaration }

export function animation(builder: AnimationBuilder) {
	const step = 1 / 200
	const styles = new Map<number, CSSStyleDeclaration>()
	const id = crypto.randomUUID()

	for (let i = 0; i <= 1; i += step) styles.set(i * 100, builder.makeSlice(i))

	let stylesString = `@keyframes ${id} {`

	styles.forEach((style, index) => {
		stylesString += `${index}% {`

		for (const key in style) {
			const value = style[key]

			stylesString += `${cases.paramCase(key)}: ${value};\n`
		}

		stylesString += '}'
	})

	stylesString += '}'

	const styleEl = document.createElement('style')
	styleEl.id = id
	styleEl.textContent = stylesString
	document.head.appendChild(styleEl)

	const iterations = builder.iterations == Infinity ? 'infinite' : builder.iterations
	const cssAnimationString = `${id} ${builder.duration}ms linear ${builder.delay}ms ${iterations} normal`

	function attachCSS() {
		const styleEl = document.createElement('style')
		styleEl.id = id
		styleEl.textContent = stylesString
		document.head.appendChild(styleEl)
	}

	function detachCSS() {
		document.getElementById(id)?.remove()
	}

	async function perform(element: HTMLElement) {
		if (builder.iterations === Infinity)
			throw new Error('Cannot use the "perform" function on animations with an infinite number of iterations')

		const CATCHUP_DELAY = 100

		attachCSS()
		element.style.animation = cssAnimationString

		await delay(CATCHUP_DELAY + builder.delay + builder.duration * builder.iterations)
		detachCSS()
	}

	return {
		attachCSS,
		detachCSS,
		cssAnimationString,
		perform,
	}
}
