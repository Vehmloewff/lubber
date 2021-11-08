import { widget, Text, createLubberApplication, Center } from '../mod.ts'

function App() {
	const { $, build } = widget()

	build(() => Center({ child: Text('Hello, World!') }))

	return { $ }
}

createLubberApplication({ rootWidget: App() })
