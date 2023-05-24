import { ui } from './deps.ts'

export interface SizedBoxProps {
	child?: ui.Component | null
	width?: number | null
	height?: number | null
}

export function SizedBox(props: SizedBoxProps = {}) {
	const { $, render, use } = ui.makeComponent()

	let width = props.width ?? null
	let height = props.height ?? null

	const generics = use(new ui.SingleChildGenerics())

	const styler = use(
		new ui.Styler((style) => {
			if (width === null) style.width = '100%'
			else style.width = ui.toRems(width)

			if (height === null) style.height = '100%'
			else style.height = ui.toRems(height)
		}),
	)

	render(new ui.ElementComponent())
	generics.setChild(props.child || null)

	function setHeight(newHeight: number | null) {
		height = newHeight
		styler.restyle()
	}

	function setWidth(newWidth: number | null) {
		width = newWidth
		styler.restyle()
	}

	function setChild(child: ui.Component | null) {
		generics.setChild(child)
	}

	return { $, setHeight, setWidth, setChild }
}
