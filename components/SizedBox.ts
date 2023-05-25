import { Component, ElementComponent, makeComponent, SingleChildGenerics, Styler, toRems } from './deps.ts'

export interface SizedBoxProps {
	child?: Component | null
	width?: number | null
	height?: number | null
}

export function SizedBox(props: SizedBoxProps = {}) {
	const { $, render, use } = makeComponent()

	let width = props.width ?? null
	let height = props.height ?? null

	const generics = use(new SingleChildGenerics())

	const styler = use(
		new Styler((style) => {
			if (width === null) style.width = '100%'
			else style.width = toRems(width)

			if (height === null) style.height = '100%'
			else style.height = toRems(height)
		}),
	)

	render(new ElementComponent())
	generics.setChild(props.child || null)

	function setHeight(newHeight: number | null) {
		height = newHeight
		styler.restyle()
	}

	function setWidth(newWidth: number | null) {
		width = newWidth
		styler.restyle()
	}

	function setChild(child: Component | null) {
		generics.setChild(child)
	}

	return { $, setHeight, setWidth, setChild }
}
