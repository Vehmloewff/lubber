/// <reference lib="dom" />

import { makeContext, Context } from './context.ts'
import { WidgetMaker, Size, Widget, BuildFn, UnknownPromiseFn, Layout } from './types.ts'

export function widget(): WidgetMaker {
	let thisContext: Context | null = null
	let buildFn: BuildFn | null = null
	let activeChildWidget: Widget | null = null
	let stashedParentElement: HTMLElement | null = null
	let stashedLayout: Layout | null = null

	let beforeDestroyFn: UnknownPromiseFn | null = null
	let afterDestroyFn: UnknownPromiseFn | null = null
	let beforeMountFn: UnknownPromiseFn | null = null
	let afterMountFn: UnknownPromiseFn | null = null

	async function preferredSize(parentContext: Context): Promise<Size> {
		if (!buildFn) throw new Error('"build" was not called before widget was mounted')

		thisContext = makeContext(parentContext)
		activeChildWidget = await buildFn(thisContext)

		return activeChildWidget.$.preferredSize(thisContext)
	}

	async function mount(parentElement: HTMLElement, layout: Layout): Promise<void> {
		if (!activeChildWidget) throw new Error('"mount" was called before "preferredSize"')

		stashedParentElement = parentElement
		stashedLayout = layout

		if (beforeMountFn) await beforeMountFn()
		await activeChildWidget.$.mount(parentElement, layout)
		if (afterMountFn) await afterMountFn()
	}

	async function destroy(): Promise<void> {
		console.log('destroy')

		if (!activeChildWidget) throw new Error('widget has already been destroyed')

		console.log(beforeDestroyFn)
		if (beforeDestroyFn) await beforeDestroyFn()
		await activeChildWidget.$.destroy()
		if (afterDestroyFn) await afterDestroyFn()

		thisContext = null
		activeChildWidget = null

		beforeDestroyFn = null
		afterDestroyFn = null
		beforeMountFn = null
		afterDestroyFn = null
	}

	function build(fn: BuildFn): void {
		if (buildFn) throw new Error('"build" can only be called once in each widget')

		buildFn = fn
	}

	async function setState(fn: UnknownPromiseFn): Promise<void> {
		if (!activeChildWidget || !thisContext || !buildFn || !stashedParentElement || !stashedLayout)
			throw new Error('"setState" cannot be called before widget is mounted or after it is destroyed')

		await fn()

		console.log('setState', activeChildWidget)

		await activeChildWidget.$.destroy()
		activeChildWidget = await buildFn(thisContext)

		await activeChildWidget.$.preferredSize(thisContext)
		await activeChildWidget.$.mount(stashedParentElement, stashedLayout)
	}

	function beforeDestroy(fn: UnknownPromiseFn): void {
		if (beforeDestroyFn) throw new Error('"beforeDestroy" cannot be called more than once inside a widget')

		beforeDestroyFn = fn
	}

	function afterDestroy(fn: UnknownPromiseFn): void {
		if (afterDestroyFn) throw new Error('"afterDestroy" cannot be called more than once inside a widget')

		afterDestroyFn = fn
	}

	function beforeMount(fn: UnknownPromiseFn): void {
		if (beforeMountFn) throw new Error('"beforeMount" cannot be called more than once inside a widget')

		beforeMountFn = fn
	}

	function afterMount(fn: UnknownPromiseFn): void {
		if (afterMountFn) throw new Error('"afterMount" cannot be called more than once inside a widget')

		afterMountFn = fn
	}

	return { build, setState, beforeDestroy, afterDestroy, beforeMount, afterMount, $: { preferredSize, mount, destroy } }
}
