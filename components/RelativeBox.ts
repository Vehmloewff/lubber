import { Component, BoxSides } from '../mod.ts'

export interface RelativeBoxParams {
	child?: Component
	positionAdjustments?: Partial<BoxSides<number>>
}
