import { bundleWatch } from 'https://code.jikno.com/devops@0.1.0/bundle/mod.ts'
import { env } from 'https://code.jikno.com/devops@next/lib/mod.ts'
import { shouldReload } from 'https://code.jikno.com/devops@next/cli/mod.ts'
import { sh } from 'https://deno.land/x/dtils@1.6.3/lib/sh.ts'
// import * as dtils from 'https://deno.land/x/dtils@2.0.0-beta.5/mod.ts'
import * as porter from 'https://deno.land/x/port@1.0.0/mod.ts'
import { open } from 'https://deno.land/x/open@v0.0.6/index.ts'

/** @asset [darwin] https:// */
export async function example(args: string[]) {
	const validExamples = await readDir('examples').then((entries) => entries.filter((entry) => entry.isDirectory).map((entry) => entry.name))

	const example = args[0]
	if (!example) throw new Error(`Expected an example name as the first argument. Valid example names are ${validExamples.join(', ')}`)
	if (!validExamples.includes(example)) {
		throw new Error(`Example "${example}" does not exist. Valid examples are ${validExamples.join(', ')}`)
	}

	await bundleWatch({
		abortSignal: new AbortController().signal,
		entryPath: `examples/${example}/main.ts`,
		env: { ENV: env },
		shouldRefetchRemote: shouldReload,
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

	const port = await porter.getAvailablePort()
	if (!port) throw new Error('Could not find an available port')

	// Serve up the current example
	await Promise.all([
		sh('deno run -A --watch examples/serve.ts', {
			env: { PORT: `${port}` },
		}),
		// setTimeout(() => open(`http://localhost:${port}`)),
	])
}

async function readDir(dir: string) {
	const entries: Deno.DirEntry[] = []

	for await (const entry of Deno.readDir(dir)) entries.push(entry)

	return entries
}
