import { gui, render } from './mod.ts'
import { Text } from './Text.ts'
import { Div } from './Div.ts'

function App() {
	const { $, template, setState } = gui()

	let showCounter = true

	template(() =>
		Div({
			children: showCounter ? [Counter()] : [],
			style: { width: '100px', height: '100px', background: 'red' },
			on: {
				click() {
					setState(() => (showCounter = !showCounter))
				},
			},
		})
	)

	return { $ }
}

function Counter() {
	const { $, template, setState, onDestroy } = gui()
	let count = 0

	const interval = setInterval(() => setState(() => count++), 1000)
	onDestroy(() => clearInterval(interval))

	template(() => Text(`Hello, World! ${count}`))

	return { $ }
}

render(App())
