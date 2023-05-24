import { Widget } from './Widget.ts'
import { ui } from './deps.ts'
import { getPosition, GridLayout } from './layout.ts'
import { GridWidget } from './types.ts'

export interface WidgetsProps {
	layout: GridLayout
	widgets: GridWidget[]
}

export interface Widgets extends ui.Component {
	update(newWidgets: GridWidget[], newLayout: GridLayout): void
}

export function Widgets(props: WidgetsProps) {
	const { $, render } = ui.makeComponent()

	let widgets = props.widgets
	let layout = props.layout

	const stack = ui.Stack<Widget>({ children: [] })
	render(stack)
	updateWidgetsOnGrid()

	function updateWidgetsOnGrid() {
		console.log(widgets)
		// First, update/add widgets that are in provided widgets
		for (const widget of widgets) {
			const physicalWidget = stack.children.find((child) => child.id === widget.id)

			const position = getPosition({
				layout,
				spanX: widget.spanX,
				spanY: widget.spanY,
				x: widget.startCell.x,
				y: widget.startCell.y,
			})

			if (physicalWidget) physicalWidget.setPosition(position)
			else stack.push(Widget({ id: widget.id, position }))
		}

		// Then, remove the widgets that aren't
		for (const physicalWidget of [...stack.children]) {
			const widget = widgets.find((widget) => widget.id === physicalWidget.id)
			if (widget) continue

			const widgetIndex = stack.children.findIndex((w) => w.id === physicalWidget.id)
			stack.removeChild(widgetIndex)
		}
	}

	function update(newWidgets: GridWidget[], newLayout: GridLayout) {
		widgets = newWidgets
		layout = newLayout

		updateWidgetsOnGrid()
	}

	return { $, update }
}
