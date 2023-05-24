import { Block } from './Block.ts'
import { ui } from './deps.ts'

export type FlexDirection = 'row' | 'column'

export type FlexAlign = 'center' | 'start' | 'end' | 'stretch' | 'baseline'
export type FlexJustify =
	| 'center'
	| 'start'
	| 'end'
	| 'space_between'
	| 'space_around'
	| 'space_evenly'
	| 'stretch'

export interface FlexProps {
	children: ui.Component[]
	gap?: number
	align?: FlexAlign
	justify?: FlexJustify
	wrap?: boolean
}

export function Flex(direction: FlexDirection, props: FlexProps) {
	const { $, render, use } = ui.makeComponent()

	const styler = use(
		new ui.Styler((style) => {
			style.display = 'flex'
			style.flexDirection = direction
			style.gap = ui.toRems(gap)
			style.alignItems = align
			style.justifyContent = justify
		}),
	)
	const generics = use(ui.makeGenerics())

	render(Block())

	let gap = props.gap ?? 0
	let align = props.align ?? 'stretch'
	let justify = props.justify ?? 'start'

	generics.push(...props.children)

	function setDirection(newDirection: FlexDirection) {
		direction = newDirection
		styler.restyle()
	}

	function setGap(newGap: number) {
		gap = newGap
		styler.restyle()
	}

	function setAlign(newAlign: FlexAlign) {
		align = newAlign
		styler.restyle()
	}

	function setJustify(newJustify: FlexJustify) {
		justify = newJustify
		styler.restyle()
	}

	return { $, setDirection, setGap, setAlign, setJustify, ...generics }
}

export interface FlexItemProps {
	child: ui.Component
	shrink?: boolean
	expand?: boolean | number
}

export function FlexItem(props: FlexItemProps) {
	const { $, render, use } = ui.makeComponent()

	const generics = use(new ui.SingleChildGenerics())
	const styler = use(
		new ui.Styler((style) => {
			style.flexBasis = '0'
			style.flexGrow = `${expansionRate === true ? 1 : expansionRate === false ? 0 : expansionRate}`
			style.flexShrink = shrink ? '1' : '0'
		}),
	)

	render(new ui.ElementComponent())

	let expansionRate = props.expand ?? false
	let shrink = props.shrink ?? false

	function setChild(child: ui.Component | null) {
		generics.setChild(child)
	}

	function setShrink(shouldShrink = true) {
		shrink = shouldShrink
		styler.restyle()
	}

	function setExpand(newExpansion: boolean | number) {
		expansionRate = newExpansion
		styler.restyle()
	}

	return { $, setChild, setShrink, setExpand }
}

export function Row(props: FlexProps) {
	const { setDirection: _, ...keys } = Flex('row', props)

	return keys
}

export function Column(props: FlexProps) {
	const { setDirection: _, ...keys } = Flex('column', props)

	return keys
}
