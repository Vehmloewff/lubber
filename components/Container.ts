import { lubber, Component, Div, getLayout } from '../mod.ts'
import { BoxSides, BoxCorners } from './types.ts'

export interface ContainerParams {
	width?: number
	maxWidth?: number
	height?: number
	minHeight?: number
	margin?: number | Partial<BoxSides<number>>
	padding?: number | Partial<BoxSides<number>>
	borderRadius?: number | Partial<BoxCorners<number>>
	border?: BorderStyle | Partial<BoxSides<BorderStyle>>
	color?: string
	child?: Component
	boxShadow?: BoxShadow
	positionAdjustments?: Partial<BoxSides<number>>
	opacity?: number
	visible?: boolean
	transition?: Record<string, number>
	transform?: string
}

const getSumX = (box: Partial<BoxSides<number>> | number | undefined) => {
	if (box === undefined) return 0

	if (typeof box === 'number') return box * 2

	return (box.left ?? 0) + (box.right ?? 0)
}

const getSumXBorders = (borders: ContainerParams['border']) => {
	if (!borders) return 0

	if ((borders as BorderStyle).width !== undefined) return (borders as BorderStyle).width * 2

	const box = borders as Partial<BoxSides<BorderStyle>>
	return (box.left?.width ?? 0) + (box.right?.width ?? 0)
}

const getSumY = (box: Partial<BoxSides<number>> | number | undefined) => {
	if (box === undefined) return 0

	if (typeof box === 'number') return box * 2

	return (box.top ?? 0) + (box.bottom ?? 0)
}

const getSumYBorders = (borders: ContainerParams['border']) => {
	if (!borders) return 0

	if ((borders as BorderStyle).width !== undefined) return (borders as BorderStyle).width * 2

	const box = borders as Partial<BoxSides<BorderStyle>>
	return (box.top?.width ?? 0) + (box.bottom?.width ?? 0)
}

export function Container(params: ContainerParams = {}) {
	const { $, template } = lubber()

	template(context => {
		const layout = getLayout(context)
		const width = getWidth(layout.spaceX, params)

		return Div({
			style: {
				position: 'relative',
				width: `${width}px`,
				height: ``,
			},
		})
	})

	return { $ }
}

function getWidth(spaceX: number, params: ContainerParams): number {
	if (params.width !== undefined) {
		const requiredExtraSpace = getSumX(params.margin) + getSumX(params.padding) + getSumXBorders(params.border)
		if (params.width + requiredExtraSpace > spaceX)
			console.warn(`Container overflowed it\'s parent by ${spaceX - requiredExtraSpace + params.width}px`)

		return params.width
	}

	if (params.maxWidth !== undefined) {
		const requiredExtraSpace = getSumX(params.margin) + getSumX(params.padding) + getSumXBorders(params.border)
		if (params.maxWidth + requiredExtraSpace > spaceX)
			console.warn(`Container overflowed it\'s parent by ${spaceX - requiredExtraSpace + params.width}px`)

		return params.width
	}
}
