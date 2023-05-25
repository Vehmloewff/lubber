import { Cells } from './Cells.ts'
import { Widgets } from './Widgets.ts'
import { ui } from './deps.ts'
import { GridLayout, inferGridLayout } from './layout.ts'
import { GridWidget } from './types.ts'

export interface GridProps {
	widgets: GridWidget[]
}

export function Grid(props: GridProps) {
	const { $, render, use } = ui.makeComponent()

	let layout: GridLayout | null = null

	let cellsComponent: Cells | null = null
	const cellsSwitch = ui.SingleChildBlock()

	let widgetsComponent: Widgets | null = null
	const widgetsSwitch = ui.SingleChildBlock()

	const dimensions = use(ui.makeDimensionProvider())

	use(
		new ui.LifecycleListeners({
			onMounted() {
				resetLayout()
			},
		}),
	)

	render(
		ui.Stack({
			children: [
				ui.StackItem({ child: cellsSwitch, inset: 0 }),
				ui.StackItem({ child: widgetsSwitch, inset: 0 }),
			],
		}),
	)

	function setCellsShowing(showing: boolean) {
		if (!layout) throw new Error('Cannot set the cells to be showing until the component has mounted')

		if (showing) {
			cellsComponent = Cells({ layout })
			cellsSwitch.setChild(cellsComponent)
		} else {
			cellsComponent = null
			cellsSwitch.setChild(null)
		}
	}

	function resetLayout() {
		layout = inferGridLayout(dimensions.getWidth(), dimensions.getHeight())

		if (!widgetsComponent) {
			widgetsComponent = Widgets({ layout, widgets: props.widgets })
			widgetsSwitch.setChild(widgetsComponent)
		}

		if (cellsComponent) cellsComponent.updateLayout(layout)
	}

	return { $, setCellsShowing, resetLayout }
}
