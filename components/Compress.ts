import { ui } from './deps.ts'

export interface CompressProps {
	child?: ui.Component | null
}

/**
 * Compresses a single, mutable child. The child will no longer expand to fill
 * all available space, but instead, only fill the space it needs */
export function Compress(props: CompressProps = {}) {
	const { $, render, use } = ui.makeComponent()

	const generics = use(new ui.SingleChildGenerics())

	render(new ui.ElementComponent())

	if (props.child) generics.setChild(props.child)

	function setChild(child: ui.Component | null) {
		generics.setChild(child)
	}

	return { $, setChild }
}
