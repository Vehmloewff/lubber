import { Component, makeComponent, SingleChildGenerics } from './deps.ts'
import { Block } from './mod.ts'

export interface SingleChildBockProps {
	child?: Component | null
}

/** An unstyled component with a single, mutable child */
export function SingleChildBlock(props: SingleChildBockProps = {}) {
	const { $, render, use } = makeComponent()

	const generics = use(new SingleChildGenerics())
	const view = Block()

	render(view)

	if (props.child) generics.setChild(props.child)

	function setChild(child: Component | null) {
		generics.setChild(child)
	}

	return { $, setChild }
}
