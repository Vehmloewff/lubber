import { Container } from './Container.ts'

import { Label } from './Label.ts'
import { Padding } from './Padding.ts'
import { ui } from './deps.ts'

export interface ButtonProps {
	onPressed?: VoidFunction | null
	primary?: boolean
}

/** A simple button component. Only takes up the space it needs. */
export function Button(text: string | null, props: ButtonProps = {}) {
	const { $, render, use } = ui.makeComponent()

	use(
		new ui.ElementListeners({
			onPressed() {
				if (props.onPressed) props.onPressed()
			},
			onHovering(isHovering) {
				currentlyHovering = isHovering
				updateStyles()
			},
			onPressing(isPressing) {
				currentlyPressing = isPressing
				updateStyles()
			},
		}),
	)

	const updateStyles = () => {
		view.setColor(computeColor())
		label.setColor(props.primary ? 'white' : 'black')

		if (currentlyPressing) view.setRing(props.primary ? ui.setAlpha('blue', 0.3) : ui.setAlpha('black', 0.05), 3)
		else view.setRing(null)
	}

	let currentlyPressing = false
	let currentlyHovering = false

	const label = Label(text, { bold: true })
	const view = Container({
		child: Padding({ paddingX: 10, paddingY: 2 }),
		borderRadius: 4,
		cursor: 'pointer',
	})

	function computeColor(): ui.Color {
		if (props.primary) {
			if (currentlyHovering) return ui.setAlpha('blue', 0.9)
			return 'blue'
		}

		if (currentlyHovering) return ui.setAlpha('black', 0.15)
		return ui.setAlpha('black', 0.1)
	}

	render(view)

	function setText(newText: string) {
		label.setText(newText)
	}

	return { $, setText }
}
