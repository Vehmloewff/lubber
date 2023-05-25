import { SkeletonLoader } from '../SkeletonLoader.ts'
import { theme } from '../globals.ts'
import { cleanupWidget, getWidget } from '../widget.ts'
import { ui } from './deps.ts'
import { GridItemPosition } from './types.ts'

export interface WidgetProps {
	position: GridItemPosition
	id: string
}

export interface Widget extends ui.Component {
	setPosition(position: GridItemPosition): void
	id: string
}

export function Widget(props: WidgetProps): Widget {
	const { $, render, use } = ui.makeComponent()

	const widget = getWidget(props.id)
	let destroyed = false

	use(
		new ui.LifecycleListeners({
			onDestroy() {
				cleanupWidget(props.id)
				destroyed = true
			},
		}),
	)

	const loaderSwitch = ui.SingleChildBlock({ child: buildSkeleton() })
	const widgetSwitch = ui.SingleChildBlock()

	const sizedBox = ui.SizedBox({
		height: props.position.height,
		width: props.position.width,
		child: ui.Container({
			borderRadius: 10,
			clip: true,
			child: ui.Stack({
				children: [
					ui.StackItem({ inset: 0, child: loaderSwitch }),
					ui.StackItem({ inset: 0, child: widgetSwitch }),
				],
			}),
		}),
	})

	const stackItem = ui.StackItem({ child: sizedBox, top: props.position.posY, left: props.position.posX })

	render(stackItem)

	widget.getElement().then((element) => {
		if (destroyed) return

		widgetSwitch.setChild(buildWidget(element))
		loaderSwitch.setChild(null)
	})

	function buildWidget(element: HTMLElement) {
		return ui.Transition({
			in: ui.makeFadeAnimator(),
			child: ui.Container({
				color: theme.get().background,
				child: ui.RenderElement({ element }),
			}),
		})
	}

	function buildSkeleton() {
		return ui.Transition({
			out: ui.makeFadeAnimator({ delay: 300 }),
			child: ui.Container({
				color: ui.setAlpha(theme.get().background, 0.3),
				child: SkeletonLoader(),
			}),
		})
	}

	function setPosition(position: GridItemPosition) {
		sizedBox.setWidth(position.width)
		sizedBox.setHeight(position.height)
		stackItem.setTop(position.posY)
		stackItem.setLeft(position.posX)
	}

	return { $, id: props.id, setPosition }
}
