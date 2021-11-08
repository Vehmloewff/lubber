import { Widget } from '../types.ts'

export interface BoxSides<T> {
	top: T
	right: T
	left: T
	bottom: T
}

export interface BoxCorners<T> {
	topLeft: T
	topRight: T
	bottomRight: T
	bottomLeft: T
}

export type MainAxisAlignment = 'center' | 'start' | 'end' | 'space-around' | 'space-between'
export type CrossAxisAlignment = 'center' | 'start' | 'end' | 'stretch'

export interface FlexSystemParams {
	children: Widget[]
	collapseMainAxis?: boolean
	collapseCrossAxis?: boolean
	mainAxisAlignment?: MainAxisAlignment
	crossAxisAlignment?: CrossAxisAlignment
}
