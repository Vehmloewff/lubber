import { ui } from './deps.ts'
import { Block } from './mod.ts'

export interface SingleChildBockProps {
	child?: ui.Component | null
}

/** An unstyled component with a single, mutable child */
export function SingleChildBlock(props: SingleChildBockProps = {}) {
	const { $, render, use } = ui.makeComponent()

	const generics = use(new ui.SingleChildGenerics())
	const view = Block()

	render(view)

	if (props.child) generics.setChild(props.child)

	function setChild(child: ui.Component | null) {
		generics.setChild(child)
	}

	return { $, setChild }
}
