import { Component } from '../mod.ts'

export type FontType = 'sans' | 'serif' | 'mono'

export interface FontConfig {
	type: FontType
	italic: boolean
	bold: boolean
	bytes: Uint8Array
}

/**
 * UNSTABLE: This api is expected to change drastically in the near future */
export interface Renderer {
	registerFont(font: FontConfig): Promise<void>
	getFontName(type: FontType): string
	renderComponent(component: Component): void
}
