import { Block } from './Block.ts'
import { ui } from './deps.ts'

export interface RenderElementProps {
	element: HTMLElement
	onDestroy?(): void
}

export function RenderElement(props: RenderElementProps) {
	const { $, render, use } = ui.makeComponent()

	use(ui.makeElementUser((element) => element.appendChild(props.element)))

	use(
		new ui.LifecycleListeners({
			onDestroy() {
				if (props.onDestroy) props.onDestroy()
			},
		}),
	)

	render(Block())

	return { $ }
}
