import { widget, Text, StyledBox, createLubberApplication, SizedBox, Padding } from '../mod.ts'

function App() {
	const { $, build } = widget()

	build(() =>
		SizedBox({
			child: StyledBox({
				color: 'red',
				child: Padding({ padding: 10, child: StyledBox({ color: 'green', child: Text('Hello, World!') }) }),
			}),
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
