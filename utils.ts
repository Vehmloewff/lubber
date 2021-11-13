/// <reference lib="dom" />

import { Layout, Widget, Size } from './types.ts'
import { ElementWidgetInitializeMountParams, ElementWidgetInitializeParams } from './element-widget.ts'
import { Context } from './context.ts'
import { RGBA, colorTools } from './color.ts'
import { ThemeData } from './theme.ts'
import { BoxShadow } from './mod.ts'

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function setPosition(element: HTMLElement, layout: Layout) {
	element.style.position = 'absolute'

	element.style.width = `${layout.width}px`
	element.style.height = `${layout.height}px`

	element.style.left = `${layout.x}px`
	element.style.top = `${layout.y}px`
}

export interface CarelessMounterResult {
	carelessMountChild(mountChild: ElementWidgetInitializeMountParams<HTMLElement>['mountChild'], layout: Layout): Promise<void>
	preferredSize: Size
}

export async function carelessMounter(
	getChildPreferredSize: ElementWidgetInitializeParams['getChildPreferredSize'],
	child?: Widget
): Promise<CarelessMounterResult> {
	if (!child) {
		return {
			carelessMountChild() {
				return Promise.resolve()
			},
			preferredSize: { width: null, height: null },
		}
	}

	const childPreferredSize = await getChildPreferredSize(child)

	async function carelessMountChild(mountChild: ElementWidgetInitializeMountParams<HTMLElement>['mountChild'], layout: Layout) {
		if (!child) throw new Error('something went wrong')

		await mountChild(child, {
			width:
				childPreferredSize.width !== null
					? childPreferredSize.width <= layout.width
						? childPreferredSize.width
						: layout.width
					: layout.width,
			height:
				childPreferredSize.height !== null
					? childPreferredSize.height <= layout.height
						? childPreferredSize.height
						: layout.height
					: layout.height,
			x: layout.x,
			y: layout.y,
		})
	}

	return {
		carelessMountChild,
		preferredSize: childPreferredSize,
	}
}

export function repeat(text: string, number: number) {
	let newText = ''

	for (let i = 1; i <= number; i++) newText += text

	return newText
}

export function sum(numbers: number[]) {
	let start = 0

	for (const number of numbers) start += number

	return start
}

export function infer<T>(a: T | 'infer', b: T | (() => T)): T {
	// deno-lint-ignore no-explicit-any
	const runB = (): T => (typeof b === 'function' ? (b as any)() : b)

	return a === 'infer' ? runB() : a
}

export type Inferable<T> = T | 'infer'

export function contrastColor(context: Context, color: RGBA, amount = 20) {
	return context.getKey('theme.isDark') ? colorTools.lighten(color, amount) : colorTools.darken(color, amount)
}

export function blendColor(context: Context, color: RGBA, amount = 20) {
	return context.getKey('theme.isDark') ? colorTools.darken(color, amount) : colorTools.lighten(color, amount)
}

export function mediumBorderRadius(context: Context) {
	const radius = context.getKey('theme.corners') as ThemeData['corners']
	console.log(radius)
	if (radius === 'sharp') return 0
	if (radius === 'gentle') return 4
	if (radius === 'round') return 100
}

export function generateShadow(elevation: number): BoxShadow {
	return {
		x: 0,
		y: 0,
		blur: elevation * 5,
		spread: elevation * 3,
		color: [0, 0, 0, 0.25],
	}
}
