# Lubber

A library for building high-precision user interfaces.

- [Docs](https://deno.land/x/lubber@0.1.0/mod.ts)
- [Manual](./manual/main.md)
- See the `examples` directory for usage examples.

## Known Issues

- Lack of doc comments, especially on components
- Must add "dom" typings to deno config
- TextInputs are quite notably lacking
- Changing theme while components are rendered does not automatically updated component's styles

## Rapidly Changing Apis

- Everything in the `color` module
- The `Renderer` type in the `render` module
- The return type of `$.mount()` (implications would impact `Styler` and `makeElementUser`)

## v1 Checklist

- [ ] More examples
- [ ] Removal of `color` and endorsement of the planned `dtils/color`
- [ ] Text input components
- [ ] Theme extensibility and auto updating
- [ ] `Renderer` to provide the rendering functionality instead of `document`. Removes the need to add "dom" typings to config
- [ ] `ProxiedDomRenderer`, `WebviewRenderer`, `HeadlessWebviewRenderer` to provide proxied rendering and efficient unit testing
- [ ] Logic manipulation components, comparable to competitors `if`, `each`, and `await`

## Contributing?

Requires [Deno](https://deno.land) and [Dirt](https://deno.land/x/dirt).

```shell
# Run the tests
dirt --test

# Run the counter example
dirt --example counter
```
