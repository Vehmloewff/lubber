import {
	RGBA,
	StyledBoxParams,
	PaddingParams,
	Widget,
	Context,
	Text,
	widget,
	StyledBox,
	Padding,
	UnknownPromiseFn,
	PressArea,
	getTheme,
	infer,
	colorTools,
	contrastColor,
	mediumBorderRadius,
	generateShadow,
} from '../mod.ts'

export interface ButtonThemeData {
	primaryColor: RGBA | 'infer'
	primaryActivateColor: RGBA | 'infer'
	primaryHoverColor: RGBA | 'infer'
	color: RGBA | 'infer'
	activateColor: RGBA | 'infer'
	hoverColor: RGBA | 'infer'
	elevation: number | 'infer'
	borderRadius: StyledBoxParams['borderRadius'] | 'infer'
	border: StyledBoxParams['border'] | 'infer'
	padding: PaddingParams['padding'] | 'infer'
}

export function setRootButtonTheme(context: Context) {
	setButtonTheme(context, {
		activateColor: 'infer',
		border: 'infer',
		borderRadius: 'infer',
		color: 'infer',
		elevation: 'infer',
		hoverColor: 'infer',
		padding: 'infer',
		primaryActivateColor: 'infer',
		primaryColor: 'infer',
		primaryHoverColor: 'infer',
	})
}

export function setButtonTheme(context: Context, buttonTheme: Partial<ButtonThemeData>) {
	context.setObject('button-theme', buttonTheme)
}

export function getButtonTheme(context: Context): ButtonThemeData {
	const theme = context.getObject('button-theme') as ButtonThemeData
	if (Object.keys(theme).length !== 10) throw new Error('root button theme was never set')

	return theme
}

export interface ButtonParams {
	primary?: boolean
	onPressed?: UnknownPromiseFn | null
	child?: Widget
}

export function Button(params: ButtonParams = {}) {
	const { $, build, setState } = widget()

	const primary = params.primary ?? false
	let active = false
	let hovering = false

	build(context => {
		const buttonTheme = getButtonTheme(context)
		const theme = getTheme(context)

		const primaryColor = infer(buttonTheme.primaryColor, theme.primaryColor)
		const primaryActivateColor = infer(buttonTheme.primaryActivateColor, () => colorTools.lowerAlpha(theme.primaryColor, 0.3))
		const primaryHoverColor = infer(buttonTheme.primaryHoverColor, () => colorTools.lowerAlpha(theme.primaryColor, 0.1))
		const color = infer(buttonTheme.color, () => contrastColor(context, theme.backgroundColor, 100))
		const activateColor = infer(buttonTheme.activateColor, () =>
			colorTools.lowerAlpha(contrastColor(context, theme.backgroundColor, 100), 0.3)
		)
		const hoverColor = infer(buttonTheme.activateColor, () =>
			colorTools.lowerAlpha(contrastColor(context, theme.backgroundColor, 100), 0.1)
		)
		const elevation = infer(buttonTheme.elevation, 0)
		const borderRadius = infer(buttonTheme.borderRadius, () => mediumBorderRadius(context))
		const border = infer(buttonTheme.border, undefined)
		const padding = infer(buttonTheme.padding, { top: 8, bottom: 8, right: 15, left: 15 })

		const trueActivateColor = primary ? primaryActivateColor : activateColor
		const trueHoverColor = primary ? primaryHoverColor : hoverColor
		const trueColor = primary ? primaryColor : color

		return StyledBox({
			border,
			borderRadius,
			color: active ? trueActivateColor : hovering ? trueHoverColor : trueColor,
			boxShadow: elevation ? generateShadow(elevation) : undefined,
			child: PressArea({
				onPressed: params.onPressed || undefined,
				onPressDown() {
					setState(() => (active = true))
				},
				onPressUp() {
					setState(() => (active = false))
				},
				onMouseEnter() {
					if (!hovering) setState(() => (hovering = true))
				},
				onMouseLeave() {
					if (hovering) setState(() => (hovering = false))
				},
				child: Padding({
					padding,
					child: params.child || Text('Button Text'),
				}),
			}),
		})
	})

	return { $ }
}
