const colors: Record<ColorString, RGBA> = {
	red: [244, 67, 54, 1],
	tomato: [255, 99, 71, 1],
	pink: [233, 30, 99, 1],
	violet: [238, 130, 238, 1],
	purple: [156, 39, 176, 1],
	deepPurple: [103, 58, 183, 1],
	indigo: [63, 81, 181, 1],
	blue: [33, 150, 243, 1],
	dodgerBlue: [30, 144, 255, 1],
	lightBlue: [135, 206, 235, 1],
	slateBlue: [106, 90, 205, 1],
	cobalt: [0, 80, 239, 1],
	cyan: [0, 188, 212, 1],
	aqua: [0, 255, 255, 1],
	teal: [0, 150, 136, 1],
	green: [76, 175, 80, 1],
	seaGreen: [60, 179, 113, 1],
	lightGreen: [139, 195, 74, 1],
	darkGreen: [9, 99, 71, 1],
	lime: [205, 220, 57, 1],
	sand: [253, 245, 230, 1],
	khaki: [240, 230, 140, 1],
	yellow: [255, 235, 59, 1],
	amber: [255, 193, 7, 1],
	orange: [255, 152, 0, 1],
	deepOrange: [255, 87, 34, 1],
	blueGray: [96, 125, 139, 1],
	blueGrey: [96, 125, 139, 1],
	brown: [121, 85, 72, 1],
	lightGray: [241, 241, 241, 1],
	lightGrey: [241, 241, 241, 1],
	gray: [241, 241, 241, 1],
	grey: [241, 241, 241, 1],
	darkGray: [97, 97, 97, 1],
	darkGrey: [97, 97, 97, 1],
	paleRed: [255, 221, 221, 1],
	paleYellow: [255, 255, 204, 1],
	paleGreen: [221, 255, 221, 1],
	paleBlue: [221, 255, 255, 1],
	black: [0, 0, 0, 1],
	white: [255, 255, 255, 1],
}

export type ColorString =
	| 'red'
	| 'tomato'
	| 'pink'
	| 'violet'
	| 'purple'
	| 'deepPurple'
	| 'indigo'
	| 'blue'
	| 'dodgerBlue'
	| 'lightBlue'
	| 'slateBlue'
	| 'cobalt'
	| 'cyan'
	| 'aqua'
	| 'teal'
	| 'green'
	| 'seaGreen'
	| 'lightGreen'
	| 'darkGreen'
	| 'lime'
	| 'sand'
	| 'khaki'
	| 'yellow'
	| 'amber'
	| 'orange'
	| 'deepOrange'
	| 'blueGray'
	| 'blueGrey'
	| 'brown'
	| 'lightGray'
	| 'lightGrey'
	| 'gray'
	| 'grey'
	| 'darkGray'
	| 'darkGrey'
	| 'paleRed'
	| 'paleYellow'
	| 'paleGreen'
	| 'paleBlue'
	| 'black'
	| 'white'

export type RGBA = [number, number, number, number]

function parseHex(hex: string): RGBA {
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

function parseRgbString(rgbString: string): RGBA {
	const errorOut = () => {
		throw new Error(`Invalid rgb string: ${rgbString}`)
	}
	const numbers = rgbString
		.replace(/rgba?/, '')
		.trim()
		.slice(1, -1)
		.split(',')
		.map(s => Number(s.trim()))

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

function parseColor(color: ColorString | string): RGBA {
	color = color.trim()

	if (colors[color as ColorString]) return colors[color as ColorString]
	if (color.startsWith('#')) return parseHex(color)
	if (color.startsWith('rgb')) return parseRgbString(color)
	if (color.startsWith('hsl')) throw new Error(`HSL colors are not supported: ${color}`)
	throw new Error(`Invalid color: ${color}`)
}

function stringifyColor(rgba: RGBA): string {
	if (rgba[3] === 1) return `rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`
	return `rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`
}

function lighten(color: string, amount = 20) {
	const parsed = parseColor(color)

	parsed[0] += amount
	parsed[1] += amount
	parsed[2] += amount

	return stringifyColor(parsed)
}

function darken(color: string, amount = 20) {
	const parsed = parseColor(color)

	parsed[0] -= amount
	parsed[1] -= amount
	parsed[2] -= amount

	return stringifyColor(parsed)
}

function mediumize(color: string, amount = 20) {
	if (colorIsDark(color)) return lighten(color, amount)
	return darken(color, amount)
}

function similarize(color: string, amount = 20) {
	if (colorIsDark(color)) return darken(color, amount)
	return lighten(color, amount)
}

function lowerAlpha(color: string, amount = 0.1) {
	return setAlpha(color, getAlpha(color) - amount)
}
function raiseAlpha(color: string, amount = 0.1) {
	return setAlpha(color, getAlpha(color) + amount)
}

function colorIsDark(color: string) {
	const [r, g, b] = parseColor(color)

	// HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
	const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))

	return hsp < 127.5
}

function setAlpha(color: string, alpha: number) {
	if (alpha > 1) alpha = 1
	else if (alpha < 0) alpha = 0

	const parsed = parseColor(color)
	parsed[3] = alpha

	return stringifyColor(parsed)
}
function getAlpha(color: string): number {
	return parseColor(color)[3]
}

export const colorTools = {
	colorIsDark,
	setAlpha,
	getAlpha,
	raiseAlpha,
	lowerAlpha,
	similarize,
	mediumize,
	darken,
	lighten,
	stringifyColor,
	parseColor,
}

export { parseColor, colors }
