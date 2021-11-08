import { widget, Text, createLubberApplication, Center, Row, Column, Stack } from '../mod.ts'

function App() {
	const { $, build } = widget()

	build(() =>
		Stack({
			children: [
				Text('Hello, World!'),
				{
					bottom: 0,
					right: 0,
					widget: Text('Hello, World!'),
				},
			],
		})
	)

	return { $ }
}

createLubberApplication({ rootWidget: App() })
