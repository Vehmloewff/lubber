import { Cell } from './Cell.ts'
import { ui } from './deps.ts'
import { getPosition, GridLayout } from './layout.ts'

export interface CellsProps {
	layout: GridLayout
}

export interface Cells extends ui.Component {
	updateLayout(newLayout: GridLayout): void
}

export function Cells(props: CellsProps): Cells {
	const { $, render } = ui.makeComponent()

	let layout = props.layout

	const cellsStack = ui.Stack<Cell>({ children: [] })

	render(cellsStack)
	updateCellsStack()

	function updateCellsStack() {
		let cellIndex = 0

		for (let y = 0; y < layout.cellCountY; y++) {
			for (let x = 0; x < layout.cellCountX; x++) {
				const physicalCell = getPosition({ layout, x, y, spanX: 1, spanY: 1 })
				const cell = cellsStack.children[cellIndex]

				if (cell) {
					cell.setPosY(physicalCell.posY)
					cell.setPosX(physicalCell.posX)
					cell.setHeight(layout.cellHeight)
					cell.setWidth(layout.cellWidth)
				} else {
					cellsStack.push(
						Cell({
							height: layout.cellHeight,
							width: layout.cellWidth,
							posX: physicalCell.posX,
							posY: physicalCell.posY,
						}),
					)
				}

				cellIndex++
			}
		}

		const updatedCellsInGraphCount = cellIndex + 1

		// We want to remove any cells in the graph that are in excess of the number of physical cells
		while (updatedCellsInGraphCount < cellsStack.children.length) {
			cellsStack.removeChild(updatedCellsInGraphCount)
		}
	}

	function updateLayout(newLayout: GridLayout) {
		layout = newLayout
		updateCellsStack()
	}

	return { $, updateLayout }
}
