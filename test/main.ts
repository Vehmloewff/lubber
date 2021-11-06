import { widget, Text, StyledBox, createLubberApplication, SizedBox } from '../mod.ts'

function App() {
	const { $, build } = widget()

	build(() =>
		StyledBox({
			child: SizedBox({ child: Text('Hello, World!') }),
			color: 'red',
		})
	)

	return { $ }
}

// function Counter() {
// 	const { $, template, setState, onDestroy } = lubber()
// 	let count = 0

// 	const interval = setInterval(() => {
// 		console.log('hi')
// 		setState(() => count++)
// 	}, 1000)

// 	onDestroy(async () => {
// 		await new Promise(resolve => setTimeout(resolve, 3000))
// 		clearInterval(interval)
// 	})

// 	template(() => Text(`Hello, World! ${count}`))

// 	return { $ }
// }

createLubberApplication({ rootWidget: App() })
