import { setAlpha, stringifyColor } from '../color.ts'
import { Block } from './Block.ts'
import { Animator, currentTheme, easing, LifecycleListeners, makeAnimationMounter, makeComponent } from './deps.ts'

export function SkeletonLoader(props: MakeSlidingPulseAnimationParams = {}) {
	const { $, render, use } = makeComponent()
	let didDestroy = false

	const mounter = use(makeAnimationMounter(makeSlidingPulseAnimation(props)))

	use(
		new LifecycleListeners({
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

export function makeSlidingPulseAnimation(params: MakeSlidingPulseAnimationParams = {}): Animator {
	return (node) => {
		const computed = getComputedStyle(node)

		const baseColor = params.useBackgroundColor ? currentTheme.get().background : currentTheme.get().foreground
		const first = `rgba(0,0,0,0) 0%`
		const last = `rgba(0,0,0,0) 100%`
		const oneThird = 1 / 3
		const twoThirds = 2 / 3
		const wrap = (internals: string) => `${computed.backgroundImage}, linear-gradient(90deg, ${first}, ${internals}, ${last})`

		return {
			delay: params.delay,
			duration: params.duration ?? 1000,
			frame(t) {
				const progressT = t < oneThird ? 0 : t > twoThirds ? 1 : easing.quartOut((t - oneThird) * 3)
				const opacityT = t <= oneThird ? t * 3 : t >= twoThirds ? 1 - ((t - twoThirds) * 3) : 1

				return { background: wrap(`${stringifyColor(setAlpha(baseColor, opacityT * 0.05))} ${progressT * 100}%`) }
			},
		}
	}
}
