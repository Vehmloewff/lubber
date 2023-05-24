import { ui } from './deps.ts'

export interface LabelProps {
	color?: ui.Color
	underline?: boolean
	italic?: boolean
	bold?: boolean
	ms?: number
	fontSize?: number
	transitionColors?: boolean
}

export function Label(text: string | null, props: LabelProps = {}) {
	const { $, render, use } = ui.makeComponent()

	const element = new ui.ElementComponent()

	let color = props.color ?? [0, 0, 0, 1]
	let underline = props.underline ?? false
	let italic = props.italic ?? false
	let bold = props.bold ?? false
	let fontSize = props.fontSize ?? 16

	const transitions = new Map<string, number>()

	if (props.transitionColors) {
		transitions.set('background-color', 150)
		transitions.set('border-color', 150)
	}

	const styler = use(
		new ui.Styler((style) => {
			style.fontFamily = '"Source Sans Pro", sans-serif'
			style.userSelect = 'none'
			style.whiteSpace = 'nowrap'

			style.color = ui.stringifyColor(color)
			style.textDecoration = underline ? 'underline' : 'none'
			style.fontStyle = italic ? 'italic' : 'normal'
			style.fontWeight = bold ? '700' : '400'
			style.fontSize = ui.toRems(fontSize)

			const transitions: string[] = []
			for (const [key, value] of transitions) {
				transitions.push(`${key} ${value}ms`)
			}
			style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)'
			style.transition = transitions.join(', ')
		}),
	)

	if (text) {
		element.htmlElement.textContent = text
	}

	render(element)

	function setText(newText: string) {
		element.htmlElement.textContent = newText
	}

	function setColor(newColor: ui.Color) {
		color = newColor
		styler.restyle()
	}

	function setUnderline(shouldUnderline: boolean) {
		underline = shouldUnderline
		styler.restyle()
	}

	function setItalic(shouldItalicize: boolean) {
		italic = shouldItalicize
		styler.restyle()
	}

	function setBold(shouldBold: boolean) {
		bold = shouldBold
		styler.restyle()
	}

	function setFontSize(newFontSize: number) {
		fontSize = newFontSize
		styler.restyle()
	}

	return { $, setText, setColor, setUnderline, setItalic, setBold, setFontSize }
}
