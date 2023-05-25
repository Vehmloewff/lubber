import { L } from './deps.ts'

function MyComponent() {
	const { $, render } = L.makeComponent()

	render(L.Label('Hello, World!'))

	return { $ }
}

L.renderDom(MyComponent())
