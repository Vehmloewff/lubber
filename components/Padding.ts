import { Component, BoxCorners } from '../mod.ts'

export interface PaddingParams {
	child?: Component
	padding?: number | Partial<BoxCorners<number>>
}
