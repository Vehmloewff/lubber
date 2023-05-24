import { Color, makeRgb } from './color.ts'

export interface Theme {
	primary: Color
	onPrimary: Color
	primaryVariant: Color
	onPrimaryVariant: Color

	secondary: Color
	onSecondary: Color
	secondaryVariant: Color
	onSecondaryVariant: Color

	background: Color
	foreground: Color

	error: Color
	success: Color
}

const darkerBlue = makeRgb(0, 95, 184)
const lighterBlue = makeRgb(0, 120, 212)

const darkerTeal = makeRgb(15, 135, 135)
const lighterTeal = makeRgb(26, 190, 189)

const dark = makeRgb(24, 24, 24)
const light = makeRgb(250, 250, 250)
const error = makeRgb(253, 97, 97)
const success = makeRgb(49, 215, 0)

export const darkTheme: Theme = {
	primary: lighterBlue,
	onPrimary: light,
	primaryVariant: darkerBlue,
	onPrimaryVariant: light,

	secondary: lighterTeal,
	onSecondary: light,
	secondaryVariant: darkerTeal,
	onSecondaryVariant: light,

	background: dark,
	foreground: light,

	error,
	success,
}

export const lightTheme: Theme = {
	primary: darkerBlue,
	onPrimary: light,
	primaryVariant: lighterBlue,
	onPrimaryVariant: light,

	secondary: darkerTeal,
	onSecondary: light,
	secondaryVariant: lighterTeal,
	onSecondaryVariant: light,

	background: light,
	foreground: dark,

	error,
	success,
}
