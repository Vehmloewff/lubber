import { BoxCorners, BoxSides } from './types.ts'
import { Widget } from '../mod.ts'
import { elementWidget } from '../element-widget.ts'
import { carelessChildMount } from '../utils.ts'

export interface BorderStyle {
	color: string
	width: number
	style: string
}

export interface BoxShadow {
	blur: number
	spread: number
	x: number
	y: number
	color: string
}

export interface StyledBoxParams {
	borderRadius?: number | Partial<BoxCorners<number>>
	border?: BorderStyle | Partial<BoxSides<BorderStyle>>
	color?: string
	gradient?: string
	child?: Widget
	boxShadow?: BoxShadow
	opacity?: number
	invisible?: boolean
	transform?: string
	filter?: string
	backdropFilter?: string
}

const getSumXBorders = (borders: StyledBoxParams['border']) => {
	if (!borders) return 0

	if ((borders as BorderStyle).width !== undefined) return (borders as BorderStyle).width * 2

	const box = borders as Partial<BoxSides<BorderStyle>>
	return (box.left?.width ?? 0) + (box.right?.width ?? 0)
}

const getSumYBorders = (borders: StyledBoxParams['border']) => {
	if (!borders) return 0

	if ((borders as BorderStyle).width !== undefined) return (borders as BorderStyle).width * 2

	const box = borders as Partial<BoxSides<BorderStyle>>
	return (box.top?.width ?? 0) + (box.bottom?.width ?? 0)
}

export function StyledBox(params: StyledBoxParams = {}) {
	return elementWidget<HTMLDivElement>('div', ({ getChildPreferredSize }) => ({
		async mount({ element, layout, mountChild }) {
			const trueWidth = layout.width - getSumXBorders(params.border)
			const trueHeight = layout.height - getSumYBorders(params.border)

			if (trueWidth < 0)
				throw new Error('borders are too wide in the X direction.  They took up all the space available and are asking for more')
			if (trueHeight < 0)
				throw new Error('borders are too wide in the Y direction.  They took up all the space available and are asking for more')

			element.style.position = 'absolute'
			element.style.width = `${trueWidth}px`
			element.style.height = `${trueHeight}px`
			element.style.left = `${layout.x}px`
			element.style.top = `${layout.y}px`

			const stringifyBorder = (border: BorderStyle) => `${border.width}px ${border.style} ${border.color}`

			if (params.border) {
				if ((params.border as BorderStyle).color) element.style.border = stringifyBorder(params.border as BorderStyle)
				else {
					const borders = params.border as Partial<BoxSides<BorderStyle>>

					if (borders.right) element.style.borderRight = stringifyBorder(borders.right)
					if (borders.left) element.style.borderLeft = stringifyBorder(borders.left)
					if (borders.bottom) element.style.borderBottom = stringifyBorder(borders.bottom)
					if (borders.top) element.style.borderTop = stringifyBorder(borders.top)
				}
			}

			if (params.color) element.style.background = params.color
			else if (params.gradient) element.style.background = params.gradient

			if (params.boxShadow)
				element.style.boxShadow = `${params.boxShadow.x}px ${params.boxShadow.y}px ${params.boxShadow.blur} ${params.boxShadow.spread} ${params.boxShadow.color}`

			if (params.opacity) element.style.opacity = `${params.opacity}`

			if (params.invisible) element.style.visibility = 'hidden'

			if (params.transform) element.style.transform = params.transform
			if (params.filter) element.style.filter = params.filter

			// I guess TS doesn't recognize backdropFilter yet
			// deno-lint-ignore no-explicit-any
			if (params.backdropFilter) (element.style as any).backdropFilter = params.backdropFilter

			if (params.child)
				await carelessChildMount({
					child: params.child,
					getChildPreferredSize,
					layout: { x: 0, y: 0, width: trueWidth, height: trueHeight },
					mountChild,
				})
		},
		preferredSize: {
			width: null,
			height: null,
		},
	}))
}
