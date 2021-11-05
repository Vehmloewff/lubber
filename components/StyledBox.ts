import { BoxCorners, BoxSides } from './types.ts'
import { Component } from '../mod.ts'

export interface BorderStyle {
	color: string
	width: number
	style: string
}

export interface BoxShadow {
	blur: number
	spread: number
	x: number
	y: number
	color: string
}

export interface StyledBoxParams {
	borderRadius?: number | Partial<BoxCorners<number>>
	border?: BorderStyle | Partial<BoxSides<BorderStyle>>
	color?: string
	child?: Component
	boxShadow?: BoxShadow
	positionAdjustments?: Partial<BoxSides<number>>
	opacity?: number
	visible?: boolean
	transform?: string
}
