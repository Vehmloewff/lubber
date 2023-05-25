import { theme } from '../globals.ts'
import { ui } from './deps.ts'

export interface CellProps {
	posX: number
	posY: number
	width: number
	height: number
}

export interface Cell {
	$: ui.ComponentInternals
	setPosX: (posX: number) => void
	setPosY: (posY: number) => void
	setWidth: (width: number) => void
	setHeight: (height: number) => void
}

export function Cell(props: CellProps): Cell {
	const { $, render } = ui.makeComponent()

	const sizedBox = ui.SizedBox({
		width: props.width,
		height: props.height,
		child: ui.Container({
			borderRadius: 10,
			borderWidth: 3,
			borderColor: ui.setAlpha(theme.get().foreground, 0.05),
			borderStyle: 'dashed',
		}),
	})

	const stackItem = ui.StackItem({ child: sizedBox, top: props.posY, left: props.posX })

	render(stackItem)

	function setPosY(posY: number) {
		stackItem.setTop(posY)
	}

	function setPosX(posX: number) {
		stackItem.setLeft(posX)
	}

	function setWidth(width: number) {
		sizedBox.setWidth(width)
	}

	function setHeight(height: number) {
		sizedBox.setHeight(height)
	}

	return { $, setPosX, setPosY, setWidth, setHeight }
}
