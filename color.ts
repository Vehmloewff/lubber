export const colorDefaults = {
	red: parseHex(`#f44336`),
	tomato: parseHex(`#ff6347`),
	pink: parseHex(`#e91e63`),
	violet: parseHex(`#ee82ee`),
	purple: parseHex(`#9c27b0`),
	deepPurple: parseHex(`#673ab7`),
	indigo: parseHex(`#3f51b5`),
	blue: parseHex(`#2196f3`),
	dodgerBlue: parseHex(`#1e90ff`),
	lightBlue: parseHex(`#87ceeb`),
	slateBlue: parseHex(`#6a5acd`),
	cobalt: parseHex(`#0050ef`),
	cyan: parseHex(`#00bcd4`),
	aqua: parseHex(`#00ffff`),
	teal: parseHex(`#009688`),
	green: parseHex(`#4caf50`),
	seaGreen: parseHex(`#3cb371`),
	lightGreen: parseHex(`#8bc34a`),
	darkGreen: parseHex(`#096347`),
	lime: parseHex(`#cddc39`),
	sand: parseHex(`#fdf5e6`),
	khaki: parseHex(`#f0e68c`),
	yellow: parseHex(`#ffeb3b`),
	amber: parseHex(`#ffc107`),
	orange: parseHex(`#ff9800`),
	deepOrange: parseHex(`#ff5722`),
	blueGray: parseHex(`#607d8b`),
	blueGrey: parseHex(`#607d8b`),
	brown: parseHex(`#795548`),
	lightGray: parseHex(`#f1f1f1`),
	lightGrey: parseHex(`#f1f1f1`),
	gray: parseHex(`#f1f1f1`),
	grey: parseHex(`#f1f1f1`),
	darkGray: parseHex(`#616161`),
	darkGrey: parseHex(`#616161`),
	paleRed: parseHex(`#ffdddd`),
	paleYellow: parseHex(`#ffffcc`),
	paleGreen: parseHex(`#ddffdd`),
	paleBlue: parseHex(`#ddffff`),
	black: parseHex(`#000000`),
	white: parseHex(`#ffffff`),
}

export type ColorString = keyof typeof colorDefaults

export interface LinearGrad {
	type: 'linear-grad'
	stops: { color: Color; starts: number }[]
	angle?: number
	hint?: number
}

export interface RadialGrad {
	type: 'radial-grad'
	position?: { x: number; y: number }
	stops: { color: Color; starts: number }[]
	hint?: number
	circle?: boolean
	extent?: 'closest-side' | 'closest-corner' | 'farthest-side' | 'farthest-corner'
}

export function makeLinearGrad(stops: { color: Color; starts: number }[], options: { angle?: number; hint?: number } = {}): LinearGrad {
	return {
		type: 'linear-grad',
		stops,
		...options,
	}
}

export function makeRgb(red: number, green: number, blue: number, alpha?: number): Color {
	return [red, green, blue, alpha || 1]
}

export type Rgba = [number, number, number, number]

export type Color =
	| ColorString
	| Rgba
	| LinearGrad
	| RadialGrad
	| Color[]

export function parseHex(hex: string): Rgba {
	const hexCharacters = 'a-f\\d'
	const match3or4Hex = `#?[${hexCharacters}]{3}[${hexCharacters}]?`
	const match6or8Hex = `#?[${hexCharacters}]{6}([${hexCharacters}]{2})?`
	const nonHexChars = new RegExp(`[^#${hexCharacters}]`, 'gi')
	const validHexSize = new RegExp(`^${match3or4Hex}$|^${match6or8Hex}$`, 'i')

	if (typeof hex !== 'string' || nonHexChars.test(hex) || !validHexSize.test(hex)) {
		throw new TypeError(`Invalid hex color: ${hex}`)
	}

	hex = hex.replace(/^#/, '')
	let alpha = 1

	if (hex.length === 8) {
		alpha = Number.parseInt(hex.slice(6, 8), 16) / 255
		hex = hex.slice(0, 6)
	}

	if (hex.length === 4) {
		alpha = Number.parseInt(hex.slice(3, 4).repeat(2), 16) / 255
		hex = hex.slice(0, 3)
	}

	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
	}

	const number = Number.parseInt(hex, 16)
	const red = number >> 16
	const green = (number >> 8) & 255
	const blue = number & 255

	return [red, green, blue, alpha]
}

export function parseRgbString(rgbString: string): Rgba {
	const errorOut = () => {
		throw new Error(`Invalid rgb string: ${rgbString}`)
	}
	const numbers = rgbString
		.replace(/rgba?/, '')
		.trim()
		.slice(1, -1)
		.split(',')
		.map((s) => Number(s.trim()))

	numbers.forEach((num, index) => {
		if (isNaN(num)) errorOut()

		if (index === 3 && (num > 1 || num < 0)) errorOut()
		else if (num > 255 || num < 0) errorOut()
	})

	if (numbers.length < 3 || numbers.length > 4) errorOut()
	if (numbers.length === 3) numbers.push(1)

	// @ts-expect-error validation is above
	return numbers
}

export function parseColor(color: ColorString | string): Rgba {
	color = color.trim()

	if (colorIsColorString(color)) return colorDefaults[color]
	if (color.startsWith('#')) return parseHex(color)
	if (color.startsWith('rgb')) return parseRgbString(color)
	if (color.startsWith('hsl')) throw new Error(`HSL colors are not supported: ${color}`)
	throw new Error(`Invalid color: ${color}`)
}

export function stringifyRgba(rgba: Rgba): string {
	if (rgba[3] === 1) return `rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`
	return `rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`
}

export function colorIsRgba(color: unknown): color is Rgba {
	if (!Array.isArray(color) || color.length !== 4) return false

	for (const num of color) {
		if (typeof num !== 'number') return false
	}

	return true
}

export function colorIsColorString(color: unknown): color is ColorString {
	return !!colorDefaults[color as ColorString]
}

export function stringifyColorString(color: ColorString) {
	return stringifyRgba(colorDefaults[color])
}

export function stringifyColor(color: Color) {
	if (colorIsRgba(color)) return stringifyRgba(color)
	if (colorIsColorString(color)) return stringifyColorString(color)

	throw new Error('It is not implemented to stringify color type yet')
}

export function getRgba(color: Color) {
	if (colorIsRgba(color)) return color
	if (colorIsColorString(color)) return colorDefaults[color]

	throw new Error('Color is to complex to have an RGB inferred from it')
}

export function lighten(color: Color, amount = 20): Rgba {
	const rgba = getRgba(color)
	let [r, g, b, a] = rgba

	r += amount
	g += amount
	b += amount

	return [r, g, b, a]
}

export function darken(color: Color, amount = 20): Rgba {
	const rgba = getRgba(color)
	let [r, g, b, a] = rgba

	r -= amount
	g -= amount
	b -= amount

	return [r, g, b, a]
}

export function mediumize(color: Color, amount = 20) {
	const rgba = getRgba(color)

	if (colorIsDark(rgba)) return lighten(rgba, amount)
	return darken(rgba, amount)
}

export function similarize(color: Color, amount = 20) {
	const rgba = getRgba(color)

	if (colorIsDark(rgba)) return darken(rgba, amount)
	return lighten(rgba, amount)
}

export function lowerAlpha(color: Color, amount = 0.1) {
	const rgba = getRgba(color)

	return setAlpha(rgba, getAlpha(rgba) - amount)
}

export function raiseAlpha(color: Color, amount = 0.1) {
	const rgba = getRgba(color)

	return setAlpha(rgba, getAlpha(rgba) + amount)
}

export function colorIsDark(color: Color) {
	const rgba = getRgba(color)

	const [r, g, b] = rgba

	// HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
	const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))

	return hsp < 127.5
}

export function setAlpha(color: Color, alpha: number): Rgba {
	const rgba = getRgba(color)

	if (alpha > 1) alpha = 1
	else if (alpha < 0) alpha = 0

	return [rgba[0], rgba[1], rgba[2], alpha]
}

export function getAlpha(color: Color): number {
	const rgba = getRgba(color)

	return rgba[3]
}
