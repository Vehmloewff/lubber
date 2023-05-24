import { makeElementUser } from './middleware.ts'
import * as svelteTransitions from 'https://esm.sh/svelte@3.59.1/transition'

export const DEFAULT_ANIMATION_DURATION = 300
export const DEFAULT_ANIMATION_DELAY = 0

export type Animator = (node: HTMLElement) => AnimatorActions

export interface AnimatorActions {
	duration?: number
	delay?: number
	fps?: number
	frame(t: number): Partial<CSSStyleDeclaration>
}

export function makeAnimationMounter(animator: Animator) {
	let element: HTMLElement | null = null

	const { attach } = makeElementUser((e) => element = e)

	function start() {
		if (!element) throw new Error('Animation cannot be started')

		const actionable = animator(element)
		const duration = actionable.duration ?? DEFAULT_ANIMATION_DURATION
		const delay = actionable.delay ?? DEFAULT_ANIMATION_DELAY
		const frames = buildKeyframes(actionable)

		return element.animate(
			// @ts-ignore A CSSDeclaration should work as a keyframe
			frames,
			{ delay, duration },
		)
	}

	return { attach, start }
}

function buildKeyframes(actionable: AnimatorActions): Partial<CSSStyleDeclaration>[] {
	const duration = actionable.duration ?? DEFAULT_ANIMATION_DURATION
	const framesPerSecond = actionable.fps ?? 60
	const millisecondsPerFrame = Math.floor(1000 / framesPerSecond)
	const framesCount = Math.ceil(duration / millisecondsPerFrame)

	const frames: Partial<CSSStyleDeclaration>[] = []

	for (let i = 0; i < framesCount; i++) {
		const t = i / (framesCount - 1)
		const frame = actionable.frame(t)

		frames.push(frame)
	}

	return frames
}

function parseCss(css: string): Record<string, string> {
	const lines = css.split(';').map((line) => line.trim())
	const style: Record<string, string> = {}

	for (const line of lines) {
		const [key, value] = line.split(':')
		if (!value) throw new Error(`Invalid css. Expected a colon on line: ${line}`)

		style[key.trim()] = value.trim()
	}

	return style
}

function transConfToAction(transConf: svelteTransitions.TransitionConfig): AnimatorActions {
	return {
		delay: transConf.delay,
		duration: transConf.duration,
		frame(rawT) {
			const t = transConf.easing ? transConf.easing(rawT) : rawT
			if (!transConf.css) throw new Error('`css` must be specified on the transition config')

			const css = transConf.css(t, 1 - t)
			return parseCss(css)
		},
	}
}

export function makeBlurAnimator(params?: svelteTransitions.BlurParams): Animator {
	return (node) => transConfToAction(svelteTransitions.blur(node, params))
}

export function makeScaleAnimator(params?: svelteTransitions.ScaleParams): Animator {
	return (node) => transConfToAction(svelteTransitions.scale(node, params))
}

export function makeSlideAnimator(params?: svelteTransitions.SlideParams): Animator {
	return (node) => transConfToAction(svelteTransitions.slide(node, params))
}

export function makeFlyAnimator(params?: svelteTransitions.FlyParams): Animator {
	return (node) => transConfToAction(svelteTransitions.fly(node, params))
}

export function makeFadeAnimator(params?: svelteTransitions.FadeParams): Animator {
	return (node) => transConfToAction(svelteTransitions.fade(node, params))
}
