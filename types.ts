/// <reference lib="dom" />
//

import { Context } from './context.ts'

export interface Widget {
	$: WidgetInternals
}

export interface PartialLayout extends FixedSize {
	x: number
	y: number
}

export interface Layout extends PartialLayout {
	parentXInViewport: number
	parentYInViewport: number
}

export interface FixedSize {
	width: number
	height: number
}

export interface Size {
	width: number | null
	height: number | null
}

// The widget mount process looks like this:
// - First, `preferredSize` is called.  It builds a template, determining the child widget
// the child widgets `preferredSize` function is called and the result returned.
// - Second, `mount` is called.
// - When the widget is destroyed, `destroy` is called.
export interface WidgetInternals {
	preferredSize(parentContext: Context): Promise<Size>
	mount(parentElement: HTMLElement, layout: Layout): Promise<void>
	destroy(): Promise<void>
}

export type BuildFn = (context: Context) => Promise<Widget> | Widget
export type UnknownPromiseFn = () => Promise<unknown> | unknown

export interface WidgetMaker {
	build(fn: BuildFn): void
	setState(fn: UnknownPromiseFn): Promise<void>
	beforeDestroy(fn: UnknownPromiseFn): void
	afterDestroy(fn: UnknownPromiseFn): void
	beforeMount(fn: UnknownPromiseFn): void
	afterMount(fn: UnknownPromiseFn): void
	$: WidgetInternals
}
