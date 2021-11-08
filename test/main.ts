import { widget, Text, createLubberApplication, Center, Row } from '../mod.ts'

function App() {
	const { $, build } = widget()

	build(() =>
		Row({
			children: [Text('Hello, World!'), Text('Hello, World!')],
			mainAxisAlignment: 'space-around',
		})
	)

	return { $ }
}

createLubberApplication({ rootWidget: App() })
