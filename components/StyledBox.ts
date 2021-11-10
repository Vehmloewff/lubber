import { BoxCorners, BoxSides } from './types.ts'
import { Widget, RGBA, colorTools } from '../mod.ts'
import { elementWidget } from '../element-widget.ts'
import { carelessMounter } from '../utils.ts'

export interface BorderStyle {
	color: RGBA
	width: number
	style: string
}

export interface BoxShadow {
	blur: number
	spread: number
	x: number
	y: number
	color: RGBA
}

export interface StyledBoxParams {
	borderRadius?: number | Partial<BoxCorners<number>>
	border?: BorderStyle | Partial<BoxSides<BorderStyle>>
	color?: RGBA
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
	return elementWidget<HTMLDivElement>('div', async ({ getChildPreferredSize }) => {
		const { carelessMountChild, preferredSize } = await carelessMounter(getChildPreferredSize, params.child)

		return {
			async mount({ element, layout, mountChild }) {
				const trueWidth = layout.width - getSumXBorders(params.border)
				const trueHeight = layout.height - getSumYBorders(params.border)

				if (trueWidth < 0)
					throw new Error(
						'borders are too wide in the X direction.  They took up all the space available and are asking for more'
					)
				if (trueHeight < 0)
					throw new Error(
						'borders are too wide in the Y direction.  They took up all the space available and are asking for more'
					)

				element.style.position = 'absolute'
				element.style.width = `${trueWidth}px`
				element.style.height = `${trueHeight}px`
				element.style.left = `${layout.x}px`
				element.style.top = `${layout.y}px`

				const stringifyBorder = (border: BorderStyle) =>
					`${border.width}px ${border.style} ${colorTools.stringifyColor(border.color)}`

				if (params.borderRadius) {
					if (typeof params.borderRadius === 'number') element.style.borderRadius = `${params.borderRadius}`
					else {
						if (params.borderRadius.topLeft) element.style.borderTopLeftRadius = `${params.borderRadius.topLeft}`
						if (params.borderRadius.topRight) element.style.borderTopRightRadius = `${params.borderRadius.topRight}`
						if (params.borderRadius.bottomLeft) element.style.borderBottomLeftRadius = `${params.borderRadius.bottomLeft}`
						if (params.borderRadius.bottomRight) element.style.borderBottomRightRadius = `${params.borderRadius.bottomRight}`
					}
				}

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

				if (params.color) element.style.background = colorTools.stringifyColor(params.color)
				else if (params.gradient) element.style.background = params.gradient

				if (params.boxShadow)
					element.style.boxShadow = `${params.boxShadow.x}px ${params.boxShadow.y}px ${params.boxShadow.blur} ${
						params.boxShadow.spread
					} ${colorTools.stringifyColor(params.boxShadow.color)}`

				if (params.opacity) element.style.opacity = `${params.opacity}`

				if (params.invisible) element.style.visibility = 'hidden'

				if (params.transform) element.style.transform = params.transform
				if (params.filter) element.style.filter = params.filter

				// I guess TS doesn't recognize backdropFilter yet
				// deno-lint-ignore no-explicit-any
				if (params.backdropFilter) (element.style as any).backdropFilter = params.backdropFilter

				await carelessMountChild(mountChild, { x: 0, y: 0, width: trueWidth, height: trueHeight })
			},
			preferredSize,
		}
	})
}
