import { StatefulComponent, Value } from './ast.ts'

const data: StatefulComponent = {
	declarations: [
		{ name: 'text', type: 'string', isParam: false, value: { $: 'string', literal: 'Hello' } },
		{ name: 'name', type: 'string', isParam: true, value: { $: 'null' } },
	],
	body: {
		name: 'Container',
		props: [
			{ name: 'color', value: { $: 'string', literal: 'red' } },
			{
				name: 'child',
				value: {
					$: 'component',
					component: {
						name: 'Label',
						props: [
							{ name: 'text', value: { $: 'string', literal: 'Hello' } },
						],
					},
				},
			},
		],
	},
}

export function generate(ast: StatefulComponent) {
	const params = new Map<string, string>()
	const declarationLines: string[] = []

	for (const declaration of ast.declarations) {
		const definition = `let ${declaration.name}: ${declaration.type}`
		const value = stringifyValue(declaration.value)

		if (!declaration.isParam) return `${definition} = ${value}`

		const paramGetter = `$params.${declaration.name}`
		declarationLines.push(`let ${declaration.name}: ${declaration.type} = ${stringifyValue(declaration.value)}`)
	}

	return declarationLines.join('\n')
}

function stringifyValue(value: Value) {
	if (value.$ === 'null') return 'null'
	if (value.$ === 'string') return `\`${value.literal.replace('`', '\\`')}\``

	throw new Error('Unknown value')
}

console.log(generate(data))
