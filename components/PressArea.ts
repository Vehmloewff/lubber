import { Widget } from '../mod.ts'
import { elementWidget } from '../element-widget.ts'
import { setPosition, carelessMounter } from '../utils.ts'

export interface TouchData {
	force: number
	radiusX: number
	radiusY: number
	rotationAngle: number
	x: number
	y: number
}

export interface MouseData {
	button: number
	x: number
	y: number
}

export interface PressAreaParams {
	onPressed?(): unknown
	onLongPress?(): unknown
	onSecondaryClick?(): unknown
	onPressedEvent?(x: number, y: number): unknown
	onPressDown?(x: number, y: number): unknown
	onPressMove?(x: number, y: number): unknown
	onPressUp?(x: number, y: number): unknown
	onMouseDown?(data: MouseData): unknown
	onMouseMove?(x: number, y: number): unknown
	onMouseUp?(data: MouseData): unknown
	onMouseEnter?(x: number, y: number): unknown
	onMouseLeave?(): unknown
	onTouchStart?(touches: TouchData[], changedTouches: TouchData[]): unknown
	onTouchMove?(touches: TouchData[], changedTouches: TouchData[]): unknown
	onTouchEnd?(touches: TouchData[], changedTouches: TouchData[]): unknown
	child?: Widget
}

export function PressArea(params: PressAreaParams = {}) {
	return elementWidget('div', async ({ getChildPreferredSize }) => {
		const { carelessMountChild, preferredSize } = await carelessMounter(getChildPreferredSize, params.child)

		return {
			async mount({ element, layout, mountChild }) {
				setPosition(element, layout)

				const rect = element.getBoundingClientRect()
				const positionX = rect.x
				const positionY = rect.y

				const mapTouches = (eventTouches: TouchList) => {
					const touches: TouchData[] = []

					for (const touchIndex in eventTouches) touches.push(mapTouch(eventTouches[touchIndex]))

					return touches
				}

				const mapTouch = (domTouch: Touch): TouchData => ({
					force: domTouch.force,
					radiusX: domTouch.radiusX,
					radiusY: domTouch.radiusY,
					rotationAngle: domTouch.rotationAngle,
					x: domTouch.clientX - positionX,
					y: domTouch.clientY - positionY,
				})

				const touchstart = (event: TouchEvent) => {
					const { x, y } = mapTouch(event.changedTouches[0])

					if (params.onPressDown) params.onPressDown(x, y)
					if (params.onTouchStart) params.onTouchStart(mapTouches(event.touches), mapTouches(event.changedTouches))
				}

				const touchmove = (event: TouchEvent) => {
					const { x, y } = mapTouch(event.changedTouches[0])

					if (params.onPressMove) params.onPressMove(x, y)
					if (params.onTouchMove) params.onTouchMove(mapTouches(event.touches), mapTouches(event.changedTouches))
				}

				const touchend = (event: TouchEvent) => {
					const { x, y } = mapTouch(event.changedTouches[0])

					if (params.onPressed) params.onPressed()
					if (params.onPressedEvent) params.onPressedEvent(x, y)
					if (params.onPressUp) params.onPressUp(x, y)
					if (params.onTouchEnd) params.onTouchEnd(mapTouches(event.touches), mapTouches(event.changedTouches))
				}

				const mousedown = (event: MouseEvent) => {
					if (params.onPressDown) params.onPressDown(event.offsetX, event.offsetY)
					if (params.onMouseDown) params.onMouseDown({ button: event.button, x: event.offsetX, y: event.offsetY })
				}

				const mousemove = (event: MouseEvent) => {
					if (params.onPressMove) params.onPressMove(event.offsetX, event.offsetY)
					if (params.onMouseMove) params.onMouseMove(event.offsetX, event.offsetY)
				}

				const mouseup = (event: MouseEvent) => {
					if (params.onPressed) params.onPressed()
					if (params.onPressedEvent) params.onPressedEvent(event.offsetX, event.offsetY)
					if (params.onPressUp) params.onPressUp(event.offsetX, event.offsetY)
					if (params.onMouseUp)
						params.onMouseUp({
							button: event.button,
							x: event.offsetX,
							y: event.offsetY,
						})
				}

				const mouseenter = (event: MouseEvent) => {
					if (params.onMouseEnter) params.onMouseEnter(event.offsetX, event.offsetY)
				}

				const mouseleave = () => {
					if (params.onMouseLeave) params.onMouseLeave()
				}

				element.addEventListener('touchstart', touchstart)
				element.addEventListener('touchmove', touchmove)
				element.addEventListener('touchend', touchend)
				element.addEventListener('mousedown', mousedown)
				element.addEventListener('mousemove', mousemove)
				element.addEventListener('mouseup', mouseup)
				element.addEventListener('mouseover', mouseenter)
				element.addEventListener('mouseleave', mouseleave)

				await carelessMountChild(mountChild, layout)
			},
			preferredSize,
		}
	})
}
