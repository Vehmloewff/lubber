import { Color, Container, currentTheme, ElementListeners, Label, makeComponent, Padding, setAlpha } from './deps.ts'
import { Pressable } from './Pressable.ts'

export interface ButtonProps {
	onPressed?: VoidFunction | null
	primary?: boolean
}

/** A simple button component. Only takes up the space it needs. */
export function Button(text: string | null, props: ButtonProps = {}) {
	const { $, render, use } = makeComponent()

	use(
		new ElementListeners({
			onPressed() {
				if (props.onPressed) props.onPressed()
			},
			onHovering(isHovering) {
				currentlyHovering = isHovering
				updateStyles()
			},
		}),
	)

	const updateStyles = () => {
		view.setColor(computeColor())
		label.setColor(props.primary ? 'white' : 'black')
	}

	let currentlyHovering = false

	const label = Label(text, { bold: true })
	const view = Container({
		child: Padding({ paddingX: 10, paddingY: 2, child: label }),
	})

	updateStyles()
	render(Pressable({ child: view }))

	function computeColor(): Color {
		if (props.primary) {
			if (currentlyHovering) return setAlpha(currentTheme.get().primary, 0.9)
			return currentTheme.get().primary
		}

		if (currentlyHovering) return setAlpha(currentTheme.get().foreground, 0.15)
		return setAlpha(currentTheme.get().foreground, 0.1)
	}

	function setText(newText: string) {
		label.setText(newText)
	}

	return { $, setText }
}
