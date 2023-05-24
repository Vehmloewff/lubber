import { bundleWatch } from 'https://code.jikno.com/devops@next/bundle/mod.ts'
import { env } from 'https://code.jikno.com/devops@next/lib/mod.ts'
import { shouldReload } from 'https://code.jikno.com/devops@next/cli/mod.ts'
import { sh } from 'https://deno.land/x/dtils@1.6.3/lib/sh.ts'

export default async () => {
	// await bundleWatch({
	// 	abortSignal: new AbortController().signal,
	// 	entryPath: 'app/main.ts',
	// 	env: { ENV: env },
	// 	shouldRefetchRemote: shouldReload,
	// 	onBundleError(error) {
	// 		console.error(error)
	// 	},
	// 	async onBundleReady(js) {
	// 		console.log('Built app')

	// 		await Deno.writeTextFile(
	// 			`server/app.bundle.ts`,
	// 			`export default ${JSON.stringify(js)}`,
	// 		)
	// 	},
	// })

	await sh('deno run -A --watch server/main.ts')
}
