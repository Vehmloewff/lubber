import { widget, Text, createLubberApplication, Center, Row, Column, Stack, colors, TextField } from '../mod.ts'

function App() {
	const { $, build, setState } = widget()

	let text = 'type here'
	let caretPosition = text.length

	build(() =>
		Stack({
			children: [
				TextField(text, {
					onCaretChange: newPos => setState(() => (caretPosition = newPos)),
					onChange: (newText, newCaretPos) =>
						setState(() => {
							text = newText
							caretPosition = newCaretPos
						}),
					caretPosition,
					focused: true,
				}),
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
