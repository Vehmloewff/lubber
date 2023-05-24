import { ui } from './deps.ts'

export interface TransitionProps {
	child: ui.Component
	in?: ui.Animator
	out?: ui.Animator
}

/**
 * Attaches the `in` and `out` transitions to `child`.
 *
 * NOTE: Does not create an element, but instead directly renders `child` */
export function Transition(props: TransitionProps) {
	const { $, render, use } = ui.makeComponent()

	const inMounter = props.in ? use(ui.makeAnimationMounter(props.in)) : null
	const outMounter = props.out ? use(ui.makeAnimationMounter(props.out)) : null

	use(
		new ui.LifecycleListeners({
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
