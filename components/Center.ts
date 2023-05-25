import { Container } from './Container.ts'
import { Compress } from './Compress.ts'
import { Component, makeComponent, Styler } from './deps.ts'

export interface CenterProps {
	child?: Component | null
}

/** Centers a single, mutable child in both directions. Child is automatically compressed */
export function Center(props: CenterProps = {}) {
	const { $, render, use } = makeComponent()

	use(
		new Styler((style) => {
			style.flexGrow = '1'
			style.flexBasis = '0'

			style.display = 'flex'
			style.alignItems = 'center'
			style.justifyContent = 'center'
		}),
	)

	const compressor = Compress({ child: props.child })

	render(Container({ child: compressor }))

	function setChild(child: Component | null) {
		compressor.setChild(child)
	}

	return { $, setChild }
}
