import { Block } from './Block.ts'
import { ui } from './deps.ts'

export interface StackProps<CT extends ui.Component> {
	children: CT[]
}

export interface Stack<CT> extends ui.Component, ui.Generics<CT> {
}

export function Stack<CT extends ui.Component>(props: StackProps<CT>): Stack<CT> {
	const { $, render, use } = ui.makeComponent()

	use(
		new ui.Styler((style) => {
			style.position = 'relative'
		}),
	)

	const generics = use(ui.makeGenerics<CT>())
	generics.push(...props.children)

	render(Block())

	return { $, ...generics }
}

export interface StackItemProps {
	child: ui.Component
	left?: number | null
	right?: number | null
	top?: number | null
	bottom?: number | null
	inset?: number | null
}

export interface StackItem {
	$: ui.ComponentInternals
	setTop: (newTop: number | null) => void
	setRight: (newRight: number | null) => void
	setBottom: (newBottom: number | null) => void
	setLeft: (newLeft: number | null) => void
	setChild: (child: ui.Component | null) => void
}

export function StackItem(props: StackItemProps): StackItem {
	const { $, render, use } = ui.makeComponent()

	let top = props.top ?? props.inset ?? null
	let right = props.right ?? props.inset ?? null
	let bottom = props.bottom ?? props.inset ?? null
	let left = props.left ?? props.inset ?? null

	const styler = use(
		new ui.Styler((style) => {
			style.position = 'absolute'
			style.top = top !== null ? ui.toRems(top) : ''
			style.right = right !== null ? ui.toRems(right) : ''
			style.bottom = bottom !== null ? ui.toRems(bottom) : ''
			style.left = left !== null ? ui.toRems(left) : ''
		}),
	)

	const generics = use(new ui.SingleChildGenerics())

	const block = new ui.ElementComponent()
	render(block)

	generics.setChild(props.child)

	function setTop(newTop: number | null) {
		top = newTop
		styler.restyle()
	}

	function setRight(newRight: number | null) {
		right = newRight
		styler.restyle()
	}

	function setBottom(newBottom: number | null) {
		bottom = newBottom
		styler.restyle()
	}

	function setLeft(newLeft: number | null) {
		left = newLeft
		styler.restyle()
	}

	function setChild(child: ui.Component | null) {
		generics.setChild(child)
	}

	return { $, setTop, setRight, setBottom, setLeft, setChild }
}
