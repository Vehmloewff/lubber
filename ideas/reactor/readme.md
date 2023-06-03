# lubber/reactor

While it is highly practical and efficient to build lower-level components without a system of reactivity, it can get increasingly clumsy as
you move to higher and higher level components. Additionally, managing reactivity by oneself can be challenging, and requires a decent
amount of knowledge.

The module provides a simple declarative language for writing user interfaces, which compiles to a reactive Lubber component.

## General Usage

Under most circumstances, you would want to use `graphite` interact with reactor.

## How it Works

In Lubber, it is common practice to create a component that takes in a series of props. Then, if a prop needs to be updated, calling
`setPropName(newValue)`. This is what reactor does behind the scenes.

## Header Files

In order for this to work, however, every component needs to have a header. Generating a header from a typescript file is pretty simple.

```ts
const headers = await inferHeader('path/to/some/file')
const buttonHeader = headers.get('Button')
```

## Parsing

The `parseReactorCode` function parses reactor code. It outputs an AST tree.

It is necessary to provide headers for dependencies.

```ts
const ast = parseReactorCode('...', {
	async giveHeader(component, url) {
		const headers = await inferHeader(url)
		return headers.get(component)
	},
})
```

## Generating

The `generateReactiveTypescript` function prints a reactive lubber component in typescript from an AST.

```ts
const tsCode = generateReactiveTypescript(ast)
```
