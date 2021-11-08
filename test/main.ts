import { widget, Text, createLubberApplication, Center, Row, Column } from '../mod.ts'

function App() {
	const { $, build } = widget()

	build(() =>
		Column({
			children: [Text('Hello, World!'), Text('Hello, World!')],
		})
	)

	return { $ }
}

createLubberApplication({ rootWidget: App() })
