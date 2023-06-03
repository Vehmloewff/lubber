import { L } from './deps.ts'

export interface ShadeProps {
	child: L.Component
	reverse?: boolean
	alpha?: number
}

export function Shade(props: ShadeProps) {
	const { $, render, use } = L.makeComponent()

	let currentAlpha = props.alpha ?? 0.4

	const container = L.Container({ child: props.child })

	const styler = use(L.makeThemeStyler((theme) => {
		const base = props.reverse ? theme.foreground : theme.background
		container.setColor(L.setAlpha(base, currentAlpha))
	}))

	render(container)

	function setAlpha(alpha: number) {
		currentAlpha = alpha
		styler.restyle()
	}

	return { $, setAlpha }
}
