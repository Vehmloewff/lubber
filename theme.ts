import { Context } from './context.ts'
import { RGBA } from './color.ts'

export interface ThemeData {
	primaryColor: RGBA
	corners: 'sharp' | 'medium' | 'round'
	backgroundColor: RGBA
	foregroundColor: RGBA
	darkTheme: boolean
}

export function setTheme(context: Context, themeData: Partial<ThemeData>) {
	context.setObject('theme', themeData)
}

export function getTheme(context: Context): ThemeData {
	const theme = context.getObject('theme') as ThemeData
	if (Object.keys(theme).length !== 5) throw new Error('Theme was never fully set')

	return theme
}
