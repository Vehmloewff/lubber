import { Block } from './Block.ts'
import { LifecycleListeners, makeComponent, makeElementUser } from './deps.ts'

export interface RenderElementProps {
	element: HTMLElement
	onDestroy?(): void
}

export function RenderElement(props: RenderElementProps) {
	const { $, render, use } = makeComponent()

	use(makeElementUser((element) => element.appendChild(props.element)))

	use(
		new LifecycleListeners({
			onDestroy() {
				if (props.onDestroy) props.onDestroy()
			},
		}),
	)

	render(Block())

	return { $ }
}
