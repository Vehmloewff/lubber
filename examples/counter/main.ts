import { L } from './deps.ts'

function Counter() {
	const { render, $ } = L.makeComponent()

	let clickedCount = 0

	const button = L.Button('Click Me', {
		primary: true,
		onPressed() {
			button.setText(`Clicked ${++clickedCount} times`)
		},
	})

	render(L.Compress({ child: button }))

	return { $ }
}

L.renderDom(Counter())
