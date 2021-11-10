import { Widget, Layout } from './types.ts'
import { makeContext } from './context.ts'
import { ThemeData, setTheme } from './theme.ts'
import { colors } from './color.ts'

export interface CreateLubberApplicationParams {
	rootElement?: string | HTMLElement
	rootWidget: Widget
	theme?: Partial<ThemeData>
}

export async function createLubberApplication(params: CreateLubberApplicationParams) {
	const context = makeContext()
	const rootElement =
		typeof params.rootElement === 'string'
			? (document.querySelector(params.rootElement) as HTMLElement)
			: params.rootElement ?? document.body

	if (!rootElement) throw new Error(`could not locate dom element "${rootElement}" in the DOM tree`)

	// Set DOM default styles
	{
		rootElement.style.position = 'fixed'
		rootElement.style.top = '0'
		rootElement.style.right = '0'
		rootElement.style.bottom = '0'
		rootElement.style.left = '0'
		rootElement.style.margin = '0'
		rootElement.style.padding = '0'

		const styleEl = document.createElement('style')
		styleEl.textContent = `* { user-select: none; overflow: hidden; }`
		document.head.appendChild(styleEl)
	}

	setTheme(
		context,
		Object.assign(
			{},
			{
				backgroundColor: colors.white,
				corners: 'medium',
				darkTheme: false,
				foregroundColor: colors.black,
				primaryColor: colors.blue,
			},
			params.theme || {}
		)
	)

	const getRootLayout = (): Layout => ({
		x: 0,
		y: 0,
		width: rootElement.clientWidth,
		height: rootElement.clientHeight,
	})

	await params.rootWidget.$.preferredSize(context)
	await params.rootWidget.$.mount(rootElement, getRootLayout())

	// Handle window resize
	{
		let timeout: number
		globalThis.window.addEventListener('resize', () => {
			clearTimeout(timeout)
			timeout = setTimeout(async () => {
				console.log('Application resized - rerendering...')
				await params.rootWidget.$.destroy()
				await params.rootWidget.$.preferredSize(context)
				await params.rootWidget.$.mount(rootElement, getRootLayout())
			}, 500)
		})
	}
}
