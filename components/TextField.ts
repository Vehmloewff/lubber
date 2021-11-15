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
} from '../mod.ts'

export interface TextFieldParams extends TextParams {
	caretColor: RGBA
	/** if not set, the default caret is used */
	caret?: Widget
	focused?: boolean
	onChange(newText: string, caretPOsition: number): unknown
	onCaretChange(newCaretPosition: number): unknown
	caretPosition: number
}

export function TextField(text: string, params: TextFieldParams) {
	const { build, $, beforeDestroy } = widget()

	const caret =
		params.caret ||
		StyledBox({
			color: params.caretColor || params.color || colors.black,
			borderRadius: 1,
			child: SizedBox({
				height: params.lineHeight || 16,
				width: 2,
			}),
		})

	const measureText = (text: string) => prepareTextWidget(text, params).width

	const unsubscribe = keystrokeListener({
		onCharacter(character) {
			if (params.onChange)
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
	})

	build(() => {
		if (!params.onChange) return Text(text, params)

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
					Text(text, params),
					{
						right: measureText(text.slice(0, params.caretPosition)),
						widget: caret,
					},
				],
			}),
		})
	})

	beforeDestroy(unsubscribe)

	return { $ }
}
