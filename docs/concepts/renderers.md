# Renderers

Currently, the only renderer we ship is `DomRenderer`. In the future, though, we plan to provide more renderers.

Renderers render your component tree into a user interface. Although interacting with a renderer directly unlocks a lot of powerful
features, this is discouraged at this time as their API is quite unstable.

For now, though, we provide a helper function to render a component with `DomRenderer`.

```ts
L.renderDom(MyComponent())
```
