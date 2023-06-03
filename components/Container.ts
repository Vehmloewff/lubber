import { SingleChildBlock } from './SingleChildBlock.ts'
import { Color, Component, makeComponent, stringifyColor, Styler, toRems } from './deps.ts'

export interface Container extends Component {
	setColor(newColor: Color): void
	setBorderRadius(newBorderRadius: number): void
	setBorder(newColor: Color, newWidth: number): void
	setBorderStyle(newStyle: string): void
	setRing(newColor: Color | null, newWidth?: number): void
	setCursor(newCursor: string): void
	setFilters(newFilters: string[]): void
	setBackdropFilters(newBackdropFilters: string[]): void
	setClip(shouldClip: boolean): void
	setChild(child: Component | null): void
}

export interface ContainerProps {
	child?: Component | null
	color?: Color
	borderRadius?: number
	borderColor?: Color
	borderWidth?: number
	borderStyle?: string
	disableColorTransition?: boolean
	ringColor?: Color | null
	ringWidth?: number
	cursor?: string
	filters?: string[]
	backdropFilters?: string[]
	clip?: boolean
}

/** Renders block that can be easily styled. May contain a single, mutable child */
export function Container(props: ContainerProps = {}) {
	const { $, render, use } = makeComponent()

	const styler = use(
		new Styler((style) => {
			// We flex here so that child elements that don't try to become "blocks" will stay at their smallest size
			style.display = 'flex'
			style.alignItems = 'start'

			style.backgroundColor = stringifyColor(color)
			style.borderRadius = toRems(borderRadius)
			style.borderColor = stringifyColor(borderColor)
			style.borderWidth = toRems(borderWidth)
			style.borderStyle = borderStyle

			const transitionStrings: string[] = []
			for (const [key, value] of transitions) {
				transitionStrings.push(`${key} ${value}ms`)
			}
			style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)'
			style.transition = transitionStrings.join(', ')

			if (ringColor) {
				style.boxShadow = `0px 0px 0px ${toRems(ringWidth)} ${stringifyColor(ringColor)}`
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
	let cursor = props.cursor ?? 'inherit'
	let filters = props.filters ?? []
	let backdropFilters = props.backdropFilters ?? []
	let clip = props.clip ?? false

	const transitions = new Map<string, number>()

	transitions.set('color', 300)
	transitions.set('background', 300)
	transitions.set('box-shadow', 300)

	function setColor(newColor: Color) {
		color = newColor
		styler.restyle()
	}

	function setBorderRadius(newBorderRadius: number) {
		borderRadius = newBorderRadius
		styler.restyle()
	}

	function setBorder(newColor: Color, newWidth: number) {
		borderColor = newColor
		borderWidth = newWidth
		styler.restyle()
	}

	function setBorderStyle(newStyle: string) {
		borderStyle = newStyle
		styler.restyle()
	}

	function setRing(newColor: Color | null, newWidth = 3) {
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

	function setChild(child: Component | null) {
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
