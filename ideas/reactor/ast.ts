export interface StatefulComponent {
	declarations: Declaration[]
	body: ComponentBody
}

export interface Declaration {
	type: string
	isParam: boolean
	name: string
	value: Value
}

export type Value = StringValue | ComponentValue | NullValue

export interface StringValue {
	$: 'string'
	literal: string
}

export interface ComponentValue {
	$: 'component'
	component: ComponentBody
}

export interface ComponentBody {
	name: string
	props: ComponentProp[]
}

export interface NullValue {
	$: 'null'
}

export interface ComponentProp {
	name: string
	value: Value
}
