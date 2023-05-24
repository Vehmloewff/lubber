import { Component } from './components/Component.ts'
import { reset } from './reset.ts'

export function render(component: Component, container: HTMLElement) {
	reset()

	const element = component.$.mount()
	container.appendChild(element)
	component.$.mounted()
}
