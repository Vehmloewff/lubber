import { Block } from './Block.ts'
import { color, theme, ui } from './deps.ts'

export function SkeletonLoader(props: MakeSlidingPulseAnimationParams = {}) {
	const { $, render, use } = ui.makeComponent()
	let didDestroy = false

	const mounter = use(ui.makeAnimationMounter(makeSlidingPulseAnimation(props)))

	use(
		new ui.LifecycleListeners({
			async onMounted() {
				const animation = mounter.start()

				while (!didDestroy) {
					await animation.finished
					animation.play()
				}
			},
			onDestroy() {
				didDestroy = true
			},
		}),
	)

	render(Block())

	return { $ }
}

export interface MakeSlidingPulseAnimationParams {
	delay?: number
	duration?: number
	useBackgroundColor?: boolean
}

export function makeSlidingPulseAnimation(params: MakeSlidingPulseAnimationParams = {}): ui.Animator {
	return (node) => {
		const computed = getComputedStyle(node)

		const baseColor = params.useBackgroundColor ? theme.currentTheme.get().background : theme.currentTheme.get().foreground
		const first = `rgba(0,0,0,0) 0%`
		const last = `rgba(0,0,0,0) 100%`
		const oneThird = 1 / 3
		const twoThirds = 2 / 3
		const wrap = (internals: string) => `${computed.backgroundImage}, linear-gradient(90deg, ${first}, ${internals}, ${last})`

		return {
			delay: params.delay,
			duration: params.duration ?? 1000,
			frame(t) {
				const progressT = t < oneThird ? 0 : t > twoThirds ? 1 : ui.easing.quartOut((t - oneThird) * 3)
				const opacityT = t <= oneThird ? t * 3 : t >= twoThirds ? 1 - ((t - twoThirds) * 3) : 1

				return { background: wrap(`${color.stringifyColor(color.setAlpha(baseColor, opacityT * 0.05))} ${progressT * 100}%`) }
			},
		}
	}
}
