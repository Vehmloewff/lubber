import { widget, Text, createLubberApplication, Center, Row, Column, Stack, Button, colors } from '../mod.ts'

function App() {
	const { $, build } = widget()

	build(() =>
		Stack({
			children: [
				Button({ primary: true, child: Text('OPEN', { bold: true, color: colors.white }) }),
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
