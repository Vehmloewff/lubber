import { Widget, BoxSides, Size, Layout } from '../mod.ts'
import { elementWidget } from '../element-widget.ts'
import { setPosition } from '../utils.ts'

export interface PositionedWidget {
	top?: number
	right?: number
	left?: number
	bottom?: number
	widget: Widget
}

export interface StackParams {
	children: (Widget | PositionedWidget)[]
}

export function Stack(params: StackParams) {
	return elementWidget('div', ({ getChildPreferredSize }) => {
		return {
			async mount({ element, layout, mountChild }) {
				setPosition(element, layout)

				for (const childOrPosition of params.children) {
					// deno-lint-ignore no-explicit-any
					const childIsUserPositioned = typeof (childOrPosition as any)?.$?.mount !== 'function'
					const child = childIsUserPositioned ? (childOrPosition as PositionedWidget).widget : (childOrPosition as Widget)
					const position: Partial<BoxSides<number>> = childIsUserPositioned ? (childOrPosition as PositionedWidget) : {}

					const preferredSize = await getChildPreferredSize(child)

					const [x, width] = evaluateX(preferredSize, position, layout)
					const [y, height] = evaluateY(preferredSize, position, layout)

					await mountChild(child, { width, height, x, y })
				}
			},
			preferredSize: { width: null, height: null },
		}
	})
}

function evaluateX(preferredSize: Size, position: Partial<BoxSides<number>>, parentLayout: Layout) {
	if (preferredSize.width === null) {
		const left = position.left ?? 0
		const width = position.right === undefined ? parentLayout.width : parentLayout.width - position.right

		return [left, width]
	} else {
		const left = position.left ?? (position.right !== undefined ? parentLayout.width - position.right - preferredSize.width : 0)

		return [left, preferredSize.width]
	}
}

function evaluateY(preferredSize: Size, position: Partial<BoxSides<number>>, parentLayout: Layout) {
	if (preferredSize.height === null) {
		const top = position.top ?? 0
		const height = position.bottom === undefined ? parentLayout.height : parentLayout.height - position.bottom

		return [top, height]
	} else {
		const top = position.top ?? (position.bottom !== undefined ? parentLayout.height - position.bottom - preferredSize.height : 0)

		return [top, preferredSize.height]
	}
}
