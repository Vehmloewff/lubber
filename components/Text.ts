import { Component } from '../mod.ts'

export function Text(text: string): Component {
	let stashedEl: HTMLSpanElement | null = null

	return {
		$: {
			mount(el) {
				const span = document.createElement('span')
				span.textContent = text
				stashedEl = span

				el.appendChild(span)

				return Promise.resolve()
			},
			destroy() {
				stashedEl?.remove()

				return Promise.resolve()
			},
		},
	}
}
