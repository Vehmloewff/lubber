import { elementWidget } from '../element-widget.ts'
import { repeat, setPosition } from '../utils.ts'
import { RGBA, colorTools } from '../mod.ts'

export interface TextShadow {
	x: number
	y: number
	blur: number
	color: RGBA
}

export interface TextParams {
	size?: number
	font?: string
	color?: RGBA
	textShadow?: TextShadow
	italic?: boolean
	bold?: boolean
	fontWeight?: number
	lineHeight?: number
	tabSpaces?: number
	clipOverflow?: boolean
}

export function prepareTextWidget(text: string, params: TextParams = {}) {
	const font = params.font ?? 'Arial, Helvetica, sans-serif'
	const size = params.size ?? 14
	const weight = params.bold ? 700 : params.fontWeight ?? 500
	const italic = params.italic ?? false

	const height = params.lineHeight ?? 16
	const width = getTextWidth(text, { font, size, weight, italic })

	return {
		width,
		Widget: () =>
			elementWidget('div', () => {
				return {
					mount({ element, layout }) {
						setPosition(element, layout)

						element.style.fontSize = `${size}px`
						element.style.fontFamily = font
						if (params.color) element.style.color = colorTools.stringifyColor(params.color)
						if (params.textShadow)
							element.style.textShadow = `${params.textShadow.x}px ${params.textShadow.y}px ${
								params.textShadow.blur
							}px ${colorTools.stringifyColor(params.textShadow.color)}`

						if (italic) element.style.textDecoration = 'italic'
						element.style.fontWeight = `${weight}`
						element.style.lineHeight = `${height}px`
						element.style.whiteSpace = 'nowrap'

						if (params.clipOverflow) element.style.textOverflow = 'ellipsis'

						element.textContent = text.replace('\t', repeat('&nbsp;', params.tabSpaces ?? 4))
					},
					preferredSize: { width, height },
				}
			}),
	}
}

export function Text(text: string, params: TextParams = {}) {
	return prepareTextWidget(text, params).Widget()
}

export interface GetTextWidthOptions {
	font: string
	size: number
	weight: number
	italic: boolean
}

let stashedCanvas: HTMLCanvasElement | null = null
export function getTextWidth(text: string, options: GetTextWidthOptions) {
	const styleString = `${options.italic ? 'italic' : options.weight} ${options.size}px ${options.font}`

	if (!stashedCanvas) stashedCanvas = document.createElement('canvas')
	const context = stashedCanvas.getContext('2d') as CanvasRenderingContext2D
	context.font = styleString

	const metrics = context.measureText(text)
	return metrics.width
}
