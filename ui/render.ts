import { Component } from './component.ts'
import { reset } from './reset.ts'

export function renderAtElement(component: Component, container: HTMLElement) {
	reset()

	const element = component.$.mount()
	container.appendChild(element)
	component.$.mounted()
}

export function renderAtRoot(component: Component) {
	const mainElement = document.createElement('div')
	mainElement.style.top = '0'
	mainElement.style.right = '0'
	mainElement.style.left = '0'
	mainElement.style.bottom = '0'
	mainElement.style.position = 'absolute'

	mainElement.style.display = 'flex'
	mainElement.style.alignItems = 'start'

	document.body.style.overflow = 'hidden'

	document.body.appendChild(mainElement)

	renderAtElement(component, mainElement)
}
