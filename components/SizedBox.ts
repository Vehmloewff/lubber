import { Component } from '../mod.ts'

export interface SizeBoxParams {
	width?: number
	maxWidth?: number
	height?: number
	minHeight?: number
	child?: Component
}
