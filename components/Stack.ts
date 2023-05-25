import { Block } from './Block.ts'
import {
	Component,
	ComponentInternals,
	ElementComponent,
	Generics,
	makeComponent,
	makeGenerics,
	SingleChildGenerics,
	Styler,
	toRems,
} from './deps.ts'

export interface StackProps<CT extends Component> {
	children: CT[]
}

export interface Stack<CT> extends Component, Generics<CT> {
}

export function Stack<CT extends Component>(props: StackProps<CT>): Stack<CT> {
	const { $, render, use } = makeComponent()

	use(
		new Styler((style) => {
			style.position = 'relative'
		}),
	)

	const generics = use(makeGenerics<CT>())
	generics.push(...props.children)

	render(Block())

	return { $, ...generics }
}

export interface StackItemProps {
	child: Component
	left?: number | null
	right?: number | null
	top?: number | null
	bottom?: number | null
	inset?: number | null
}

export interface StackItem {
	$: ComponentInternals
	setTop: (newTop: number | null) => void
	setRight: (newRight: number | null) => void
	setBottom: (newBottom: number | null) => void
	setLeft: (newLeft: number | null) => void
	setChild: (child: Component | null) => void
}

export function StackItem(props: StackItemProps): StackItem {
	const { $, render, use } = makeComponent()

	let top = props.top ?? props.inset ?? null
	let right = props.right ?? props.inset ?? null
	let bottom = props.bottom ?? props.inset ?? null
	let left = props.left ?? props.inset ?? null

	const styler = use(
		new Styler((style) => {
			style.position = 'absolute'
			style.top = top !== null ? toRems(top) : ''
			style.right = right !== null ? toRems(right) : ''
			style.bottom = bottom !== null ? toRems(bottom) : ''
			style.left = left !== null ? toRems(left) : ''
		}),
	)

	const generics = use(new SingleChildGenerics())

	const block = new ElementComponent()
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

	function setChild(child: Component | null) {
		generics.setChild(child)
	}

	return { $, setTop, setRight, setBottom, setLeft, setChild }
}
