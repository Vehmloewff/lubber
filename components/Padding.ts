import { SingleChildBlock } from './SingleChildBlock.ts'
import { Component, makeComponent, Styler, toRems } from './deps.ts'

export interface PaddingProps {
	child?: Component | null
	paddingTop?: number | null
	paddingRight?: number | null
	paddingBottom?: number | null
	paddingLeft?: number | null
	paddingX?: number | null
	paddingY?: number | null
	padding?: number | null
}

export function Padding(props: PaddingProps) {
	const { $, render, use } = makeComponent()

	const view = SingleChildBlock({ child: props.child })

	let paddingTop = props.paddingTop ?? props.paddingY ?? props.padding ?? 0
	let paddingLeft = props.paddingLeft ?? props.paddingX ?? props.padding ?? 0
	let paddingRight = props.paddingRight ?? props.paddingX ?? props.padding ?? 0
	let paddingBottom = props.paddingBottom ?? props.paddingY ?? props.padding ?? 0

	const styler = use(
		new Styler((style) => {
			style.paddingTop = toRems(paddingTop)
			style.paddingLeft = toRems(paddingLeft)
			style.paddingRight = toRems(paddingRight)
			style.paddingBottom = toRems(paddingBottom)
		}),
	)

	render(view)

	function setPaddingTop(newPaddingTop: number) {
		paddingTop = newPaddingTop
		styler.restyle()
	}

	function setPaddingLeft(newPaddingLeft: number) {
		paddingLeft = newPaddingLeft
		styler.restyle()
	}

	function setPaddingBottom(newPaddingBottom: number) {
		paddingBottom = newPaddingBottom
		styler.restyle()
	}

	function setPaddingRight(newPaddingRight: number) {
		paddingRight = newPaddingRight
		styler.restyle()
	}

	function setPaddingX(newPaddingX: number) {
		paddingRight = newPaddingX
		paddingLeft = newPaddingX
		styler.restyle()
	}

	function setPaddingY(newPaddingY: number) {
		paddingTop = newPaddingY
		paddingBottom = newPaddingY
		styler.restyle()
	}

	function setPadding(newPadding: number) {
		setPaddingY(newPadding)
		setPaddingX(newPadding)
	}

	function setChild(child: Component | null) {
		view.setChild(child)
	}

	return { $, setPaddingTop, setPaddingRight, setPaddingBottom, setPaddingLeft, setPaddingX, setPaddingY, setPadding, setChild }
}
