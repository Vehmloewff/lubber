import { SingleChildBlock } from './SingleChildBlock.ts'
import { ui } from './deps.ts'

export interface ContainerProps {
	child?: ui.Component | null
	color?: ui.Color
	borderRadius?: number
	borderColor?: ui.Color
	borderWidth?: number
	borderStyle?: string
	disableColorTransition?: boolean
	ringColor?: ui.Color | null
	ringWidth?: number
	cursor?: string
	filters?: string[]
	backdropFilters?: string[]
	clip?: boolean
}

/** Renders block that can be easily styled. May contain a single, mutable child */
export function Container(props: ContainerProps = {}) {
	const { $, render, use } = ui.makeComponent()

	const styler = use(
		new ui.Styler((style) => {
			// We flex here so that child elements that don't try to become "blocks" will stay at their smallest size
			style.display = 'flex'
			style.alignItems = 'start'

			style.backgroundColor = ui.stringifyColor(color)
			style.borderRadius = ui.toRems(borderRadius)
			style.borderColor = ui.stringifyColor(borderColor)
			style.borderWidth = ui.toRems(borderWidth)
			style.borderStyle = borderStyle

			const transitionStrings: string[] = []
			for (const [key, value] of transitions) {
				transitionStrings.push(`${key} ${value}ms`)
			}
			style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)'
			style.transition = transitionStrings.join(', ')

			if (ringColor) {
				style.boxShadow = `0px 0px 0px ${ui.toRems(ringWidth)} ${ui.stringifyColor(ringColor)}`
			} else style.boxShadow = ''

			style.cursor = cursor

			if (filters.length) style.filter = filters.join(' ')
			else style.filter = ''

			if (backdropFilters.length) style.backdropFilter = backdropFilters.join(' ')
			else style.backdropFilter = ''

			style.overflow = clip ? 'hidden' : ''
		}),
	)

	const view = SingleChildBlock({ child: props.child })

	render(view)

	let color = props.color ?? [0, 0, 0, 0]
	let borderRadius = props.borderRadius ?? 0
	let borderColor = props.borderColor ?? [0, 0, 0, 1]
	let borderWidth = props.borderWidth ?? 0
	let borderStyle = props.borderStyle ?? 'solid'
	let ringColor = props.ringColor ?? null
	let ringWidth = props.ringWidth ?? 0
	let cursor = props.cursor ?? 'default'
	let filters = props.filters ?? []
	let backdropFilters = props.backdropFilters ?? []
	let clip = props.clip ?? false

	const transitions = new Map<string, number>()

	function setColor(newColor: ui.Color) {
		color = newColor
		styler.restyle()
	}

	function setBorderRadius(newBorderRadius: number) {
		borderRadius = newBorderRadius
		styler.restyle()
	}

	function setBorder(newColor: ui.Color, newWidth: number) {
		borderColor = newColor
		borderWidth = newWidth
		styler.restyle()
	}

	function setBorderStyle(newStyle: string) {
		borderStyle = newStyle
		styler.restyle()
	}

	function setRing(newColor: ui.Color | null, newWidth = 3) {
		ringColor = newColor
		ringWidth = newWidth
		styler.restyle()
	}

	function setCursor(newCursor: string) {
		cursor = newCursor
		styler.restyle()
	}

	function setFilters(newFilters: string[]) {
		filters = newFilters
		styler.restyle()
	}

	function setBackdropFilters(newBackdropFilters: string[]) {
		backdropFilters = newBackdropFilters
		styler.restyle()
	}

	function setClip(shouldClip: boolean) {
		clip = shouldClip
		styler.restyle()
	}

	function setChild(child: ui.Component | null) {
		view.setChild(child)
	}

	return {
		$,
		setColor,
		setBorderRadius,
		setBorder,
		setBorderStyle,
		setRing,
		setCursor,
		setFilters,
		setBackdropFilters,
		setClip,
		setChild,
	}
}
