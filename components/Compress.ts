import { Component, ElementComponent, makeComponent, SingleChildGenerics } from './deps.ts'

export interface CompressProps {
	child?: Component | null
}

/**
 * Compresses a single, mutable child. The child will no longer expand to fill
 * all available space, but instead, only fill the space it needs */
export function Compress(props: CompressProps = {}) {
	const { $, render, use } = makeComponent()

	const generics = use(new SingleChildGenerics())

	render(new ElementComponent())

	if (props.child) generics.setChild(props.child)

	function setChild(child: Component | null) {
		generics.setChild(child)
	}

	return { $, setChild }
}
