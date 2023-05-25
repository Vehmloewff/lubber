import { ui } from './deps.ts'
import { reset } from './reset.ts'
import { FontConfig, FontType, Renderer } from './types.ts'

export function renderDom(component: ui.Component) {
	const domRenderer = new DomRenderer()

	domRenderer.renderComponent(component)
}

export class DomRenderer implements Renderer {
	#sansFontName =
		`custom-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'`
	#serifFontName =
		`custom-serif, 'Iowan Old Style', Apple Garamond, Baskerville, 'Times New Roman', 'Droid Serif', Times, 'Source Serif Pro', serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`
	#monoFontName = `custom-mono, ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace`

	registerFont(font: FontConfig) {
		const browserFont = new FontFace(`custom-${font.type}`, font.bytes, {
			style: font.italic ? 'italic' : 'normal',
			weight: font.bold ? '700' : '400',
		})

		// @ts-ignore browsers should all support this
		document.fonts.add(browserFont)

		return Promise.resolve()
	}

	getFontName(type: FontType) {
		if (type === 'sans') return this.#sansFontName
		if (type === 'mono') return this.#monoFontName
		if (type === 'serif') return this.#serifFontName

		throw new Error('Unknown fot type')
	}

	renderComponent(component: ui.Component) {
		reset()

		const mainElement = document.createElement('div')
		mainElement.style.top = '0'
		mainElement.style.right = '0'
		mainElement.style.left = '0'
		mainElement.style.bottom = '0'
		mainElement.style.position = 'absolute'

		mainElement.style.display = 'flex'
		mainElement.style.alignItems = 'start'

		document.body.style.overflow = 'hidden'

		document.body.appendChild(mainElement)

		const element = component.$.mount()
		mainElement.appendChild(element)
		component.$.mounted()
	}
}
