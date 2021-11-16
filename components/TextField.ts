import {
	TextParams,
	Widget,
	widget,
	Text,
	Stack,
	StyledBox,
	SizedBox,
	RGBA,
	colors,
	prepareTextWidget,
	PressArea,
	keystrokeListener,
	DetachedZ,
	DisablePressEvents,
} from '../mod.ts'

export interface TextFieldParams extends TextParams {
	caretColor?: RGBA
	/** if not set, the default caret is used */
	caret?: Widget
	focused?: boolean
	onChange(newText: string, caretPOsition: number): unknown
	onCaretChange(newCaretPosition: number): unknown
	caretPosition: number
	onNext?(): unknown
	onDone?(): unknown
}

export function TextField(text: string, params: TextFieldParams) {
	const { build, $, beforeDestroy } = widget()

	const caret = params.caret || DefaultCaret({ color: params.caretColor ?? colors.blue, height: params.lineHeight ?? params.size ?? 16 })

	const measureText = (text: string) => prepareTextWidget(text, params).width

	const unsubscribe = keystrokeListener({
		onCharacter(character) {
			if (params.focused)
				params.onChange(
					`${text.slice(0, params.caretPosition)}${character}${text.slice(params.caretPosition)}`,
					params.caretPosition + 1
				)
		},
		onArrowDown() {
			if (params.caretPosition !== text.length) params.onCaretChange(text.length)
		},
		onArrowUp() {
			if (params.caretPosition) params.onCaretChange(0)
		},
		onArrowLeft() {
			if (params.caretPosition) params.onCaretChange(params.caretPosition - 1)
		},
		onArrowRight() {
			if (params.caretPosition !== text.length) params.onCaretChange(params.caretPosition + 1)
		},
		onDelete() {
			if (params.caretPosition)
				params.onChange(`${text.slice(0, params.caretPosition - 1)}${text.slice(params.caretPosition)}`, params.caretPosition - 1)
		},
		onEnter() {
			if (params.onDone) params.onDone()
		},
		onTab() {
			if (params.onNext) params.onNext()
		},
	})

	build(() => {
		if (!params.focused) return Text(text, params)

		return PressArea({
			onPressedEvent(x) {
				let lastStopDistance = 0
				let position = 0

				while (position <= text.length) {
					const thisStopDistance = position ? measureText(text.slice(0, position)) : 0
					const midPoint = (thisStopDistance + lastStopDistance) / 2

					if (x <= midPoint) {
						position--
						break
					}

					if (x <= thisStopDistance) break

					lastStopDistance = thisStopDistance
					position++
				}

				params.onCaretChange(position)
			},

			child: Stack({
				shrinkTo: 0,
				children: [
					StyledBox({ cursor: 'text', child: Text(text, params) }),
					{
						left: measureText(text.slice(0, params.caretPosition)),
						widget: DisablePressEvents({ child: DetachedZ({ child: caret }) }),
					},
				],
			}),
		})
	})

	beforeDestroy(() => {
		unsubscribe()
	})

	return { $ }
}

export interface DefaultCaretParams {
	color: RGBA
	height: number
}

export function DefaultCaret(params: DefaultCaretParams) {
	const { $, build, setState, beforeDestroy } = widget()

	let blinkOn = true

	build(() =>
		StyledBox({
			color: params.color,
			borderRadius: 1.5,
			child: SizedBox({
				height: params.height,
				width: 3,
			}),
			opacity: blinkOn ? 1 : 0,
			transition: 'opacity 300ms',
		})
	)

	const timeout = setInterval(() => setState(() => (blinkOn = !blinkOn)), 800)

	beforeDestroy(() => clearInterval(timeout))

	return { $ }
}
