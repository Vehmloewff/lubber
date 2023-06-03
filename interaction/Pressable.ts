import { Component, Container, currentTheme, ElementListeners, makeComponent, makeThemeListener, setAlpha } from './deps.ts'

export interface PressableProps {
	child: Component
	onPressing?(isPressing: boolean): unknown
	onPressed?(): unknown
}

export function Pressable(props: PressableProps) {
	const { $, render, use } = makeComponent()

	let isFocused = false

	const container = Container({ child: props.child, clip: true, borderRadius: 4 })

	const focus = () => {
		isFocused = true
		container.setRing(setAlpha(currentTheme.get().primary, 0.3), 3)
	}

	const clear = () => {
		isFocused = false
		container.setRing(null)
	}

	// re-highlight if the theme changes on us
	use(makeThemeListener(() => {
		if (isFocused) focus()
	}))

	use(
		new ElementListeners({
			onPressing(isPressing) {
				if (props.onPressing) props.onPressing(isPressing)

				if (isPressing) focus()
				else clear()
			},
			onPressed() {
				if (props.onPressed) props.onPressed()
			},
		}),
	)

	render(container)

	return { $ }
}
