# lubber/graphite

A framework for shipping fully reactive user interfaces in a package.

## Usage

```ts
const graphite = makeGraphite()

graphite.includeReactor('SomeComponent', '... reactor code ...')
graphite.includeReactorAst('OtherComponent', { ... })
graphite.includePrivateReactor('PrivateComponent', '... reactor code ...')

const package = await graphite.package() // build the graph into a package

const diagnostics = package.diagnostics // Any diagnostics from mismatched types, missing imports, etc

const code = package.get('mod.ts') // auto-generated entrypoint
const allFiles = package.list() // [ 'mod.ts', 'SomeComponent.ts', 'OtherComponent.ts', 'PrivateComponent.ts' ]
```
