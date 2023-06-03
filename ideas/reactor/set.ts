import { Component } from 'https://deno.land/x/lubber@0.1.0/mod.ts'

export interface AppParams {
	snack: string | null
	page: {
		name: string
	}
}

export interface StatefulComponent<T> extends Component {
	update(state: T, paths: string[]): void
}

export function App(params: AppParams) {}
