import { Component, Container, makeComponent, Stack } from './deps.ts'

export interface ScreensManagerProps {
	base: Component
}

export function ScreensManager(props: ScreensManagerProps) {
	const { $, render } = makeComponent()

	const baseWrapper = Container({ child: props.base })
	const stack = Stack({ children: [baseWrapper] })

	render(stack)

	function setBase(newBase: Component) {
		baseWrapper.setChild(newBase)
	}

	function addPage() {}

	return { $, setBase }
}
