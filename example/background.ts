import { ui } from './deps.ts'
import { theme } from './globals.ts'

export interface ScreenBackgroundProps {
	imageUrl: string
}

export function ScreenBackground(props: ScreenBackgroundProps) {
	const { $, render } = ui.makeComponent()

	render(
		ui.Stack({
			children: [
				ui.StackItem({
					inset: 0,
					child: ui.Image(props.imageUrl, { fit: 'cover', position: 'center' }),
				}),
				ui.StackItem({
					inset: 0,
					child: ui.Container({
						backdropFilters: ['blur(50px)'],
						color: ui.setAlpha(theme.get().background, 0.3),
					}),
				}),
			],
		}),
	)

	return { $ }
}
