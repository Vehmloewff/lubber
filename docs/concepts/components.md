# Components

Components are at the heart of Lubber. We provide several lower-level components, which applications can assemble into higher-level
components, which are themselves assembled into higher-level components, which is eventually assembled into the highest level component, the
application.

This philosophy is not different from most component libraries (e.g. React, Vue, Svelte), so it will be familiar to most developers. What
sets Lubber apart, however, is it's lack of builtin reactivity.

At it's core, a component is just a function that returns an object with at least one property, `$`.

```ts
function MyComponent() {
	const { $ } = L.makeComponent()

	return { $ }
}
```

> NOTE: Because it can be possible to use many functions provided by Lubber in a single file, it is common practice to `import * as L`
> instead of importing each export separately

> NOTE: For consistency, it is convention to name all components in PascalCase.

This `$` property contains information about the component and it's lifecycle. Providing a binding between components and their children.
For now, just know that we can get this property from a call to `makeComponent()`, and we must return it from every component component.

To render content in a component, use the `render` function from `makeComponent()`.

```ts
function MyComponent() {
	const { $, render } = L.makeComponent()

	render(L.Label('Hello, World!'))

	return { $ }
}
```

And there you have it. That is a component that shows "Hello, World!" on the screen.

Reactivity doesn't have to be complex, requiring kilobytes of code or a compiler. Simply update what needs to be updated in a holistic way.

```ts
function Counter() {
	const { render, $ } = L.makeComponent()

	let clickedCount = 0

	const button = L.Button('Click Me', {
		primary: true,
		onPressed() {
			button.setText(`Clicked ${++clickedCount} times`)
		},
	})

	render(L.Compress({ child: button }))

	return { $ }
}
```

Once you have built your components, you can render them using a [loader](./loaders.md).
