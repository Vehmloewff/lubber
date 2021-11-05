import { lubber, render, Text, Div } from '../mod.ts'

function App() {
	const { $, template, setState } = lubber()

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
	const { $, template, setState, onDestroy } = lubber()
	let count = 0

	const interval = setInterval(() => {
		console.log('hi')
		setState(() => count++)
	}, 1000)

	onDestroy(async () => {
		await new Promise(resolve => setTimeout(resolve, 3000))
		clearInterval(interval)
	})

	template(() => Text(`Hello, World! ${count}`))

	return { $ }
}

render(App())
