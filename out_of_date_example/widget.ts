import { sync, ui } from './deps.ts'
import { theme } from './globals.ts'

export interface Widget {
	label: string | null
	getElement(): Promise<HTMLElement>
}

export function getWidget(id: string): Widget {
	console.log(`pretending to get get the meta for widget ${id}`)

	return {
		label: `Widget ${id}`,
		async getElement() {
			console.log(`pretending to load html element for widget ${id}`)

			await sync.delay(Math.random() * 10000)

			const component = ui.Center({
				child: ui.Label('Hello, World!', { color: theme.get().foreground }),
			})

			const element = component.$.mount()
			component.$.mounted()

			return element
		},
	}
}

/**
 * Should be called after a widget is destroyed. Notifies the application of the
 * action so that it can clear up resources the widget was using */
export function cleanupWidget(id: string) {}

/**
 * Should be called after a widget has changed sizes. This is not just when a widget
 * changes grid cells, but anytime the size of the widget changes in any way */
export function handleWidgetResize(id: string) {}
