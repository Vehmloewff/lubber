import { Container } from './Container.ts'
import { Compress } from './Compress.ts'
import { ui } from './deps.ts'

export interface CenterProps {
	child?: ui.Component | null
}

/** Centers a single, mutable child in both directions. Child is automatically compressed */
export function Center(props: CenterProps = {}) {
	const { $, render, use } = ui.makeComponent()

	use(
		new ui.Styler((style) => {
			style.flexGrow = '1'
			style.flexBasis = '0'

			style.display = 'flex'
			style.alignItems = 'center'
			style.justifyContent = 'center'
		}),
	)

	const compressor = Compress({ child: props.child })

	render(Container({ child: compressor }))

	function setChild(child: ui.Component | null) {
		compressor.setChild(child)
	}

	return { $, setChild }
}
