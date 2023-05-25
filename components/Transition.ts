import { Animator, Component, LifecycleListeners, makeAnimationMounter, makeComponent } from './deps.ts'

export interface TransitionProps {
	child: Component
	in?: Animator
	out?: Animator
}

/**
 * Attaches the `in` and `out` transitions to `child`.
 *
 * NOTE: Does not create an element, but instead directly renders `child` */
export function Transition(props: TransitionProps) {
	const { $, render, use } = makeComponent()

	const inMounter = props.in ? use(makeAnimationMounter(props.in)) : null
	const outMounter = props.out ? use(makeAnimationMounter(props.out)) : null

	use(
		new LifecycleListeners({
			onMounted() {
				inMounter?.start()
			},
			async onDestroy() {
				if (!outMounter) return

				const animation = outMounter.start()
				animation.reverse()

				await animation.finished
			},
		}),
	)

	render(props.child)

	return { $ }
}
