import { bundler, dtils } from './deps.ts'

export async function example(args: string[]) {
	const validExamples = await readDir('examples').then((entries) => entries.filter((entry) => entry.isDirectory).map((entry) => entry.name))

	const example = args[0]
	if (!example) throw new Error(`Expected an example name as the first argument. Valid example names are ${validExamples.join(', ')}`)
	if (!validExamples.includes(example)) {
		throw new Error(`Example "${example}" does not exist. Valid examples are ${validExamples.join(', ')}`)
	}

	await bundler.bundleWatch({
		abortSignal: new AbortController().signal,
		entryPath: `examples/${example}/main.ts`,
		env: { ENV: dtils.getEnv() },
		shouldRefetchRemote: dtils.getShouldReloadDeps(),
		onBundleError(error) {
			console.error(error)
		},
		async onBundleReady(js) {
			console.log('Built app')

			await Deno.writeTextFile(
				`examples/current_example.bundle.ts`,
				`export default ${JSON.stringify(js)}`,
			)
		},
	})

	// Serve up the current example
	await dtils.sh(`deno run -A --watch examples/serve.ts ${example}`)
}

async function readDir(dir: string) {
	const entries: Deno.DirEntry[] = []

	for await (const entry of Deno.readDir(dir)) entries.push(entry)

	return entries
}
