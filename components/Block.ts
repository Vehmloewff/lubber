import { ElementComponent, makeComponent, Styler } from './deps.ts'

/** A basic block component. Block components always try to expand to take up all space they are given. */
export function Block() {
	const { $, render, use } = makeComponent()

	const view = new ElementComponent()

	use(
		new Styler((style) => {
			style.width = '100%'
			style.height = '100%'
		}),
	)
	render(view)

	return { $ }
}
