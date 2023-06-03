import { color, LifecycleListeners, makeStorableListener, storable } from './deps.ts'

export interface Theme {
	primary: color.Color
	onPrimary: color.Color
	primaryVariant: color.Color
	onPrimaryVariant: color.Color

	secondary: color.Color
	onSecondary: color.Color
	secondaryVariant: color.Color
	onSecondaryVariant: color.Color

	background: color.Color
	foreground: color.Color

	error: color.Color
	success: color.Color
}

const darkerBlue = color.makeRgb(0, 95, 184)
const lighterBlue = color.makeRgb(0, 120, 212)

const darkerTeal = color.makeRgb(15, 135, 135)
const lighterTeal = color.makeRgb(26, 190, 189)

const dark = color.makeRgb(24, 24, 24)
const light = color.makeRgb(250, 250, 250)
const error = color.makeRgb(253, 97, 97)
const success = color.makeRgb(49, 215, 0)

export const defaultDarkTheme: Theme = {
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

export const defaultLightTheme: Theme = {
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

export const currentTheme = storable.makeStorable(defaultLightTheme)

/**
 * Subscribes to `currentTheme`, calling `listener` when it is updated. Unsubscribes when the component dismounts
 *
 * NOTE: Calls `listener` shortly after function is called */
export function makeThemeListener(listener: (theme: Theme) => unknown) {
	return makeStorableListener(currentTheme, listener)
}

/**
 * Subscribes/unsubscribes to `currentTheme`, calling `styler` when it is updated. A call to `restyle` will re-call
 * `styler`.
 *
 * NOTE: Calls `styler` once function is called */
export function makeThemeStyler(styler: (theme: Theme) => unknown) {
	const listener = makeThemeListener(styler)

	return {
		attach: listener.attach,
		restyle() {
			styler(currentTheme.get())
		},
	}
}
