import { ScreenBackground } from './background.ts'
import { ui } from './deps.ts'
import { Grid } from './grid/Grid.ts'

const BACKGROUND_IMG =
	'https://images.unsplash.com/photo-1581790059834-8c317f59448a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80'

const mainElement = document.createElement('div')
mainElement.style.top = '0'
mainElement.style.right = '0'
mainElement.style.left = '0'
mainElement.style.bottom = '0'
mainElement.style.position = 'absolute'

document.body.style.overflow = 'hidden'
document.body.appendChild(mainElement)

ui.render(
	ui.Stack({
		children: [
			ui.StackItem({
				inset: 0,
				child: ScreenBackground({ imageUrl: BACKGROUND_IMG }),
			}),
			ui.StackItem({
				inset: 0,
				child: Grid({
					widgets: [
						{
							id: '23451',
							startCell: { x: 0, y: 0 },
							spanX: 4,
							spanY: 2,
						},
						{
							id: 'ha82uij',

							startCell: { x: 0, y: 2 },
							spanX: 6,
							spanY: 6,
						},
						{
							id: 'hja82js',
							startCell: { x: 4, y: 0 },
							spanX: 1,
							spanY: 1,
						},
					],
				}),
			}),
		],
	}),
	mainElement,
)
