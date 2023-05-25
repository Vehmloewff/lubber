import appBundle from './current_example.bundle.ts'
import { http, mediaTypes, rooter } from './deps.ts'

const example = Deno.args[0] || 'Unnamed'

const template = `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>${example}</title>

		<link href="/fonts.css" rel="stylesheet" />
		<script src="/bundle.js" defer></script>
	</head>
	<body></body>
	</html>
`

const appTemplateRoute = rooter.makeRoute(
	'GET /',
	() => new Response(template, { headers: { 'content-type': 'text/html' } }),
)

const appJsRoute = rooter.makeRoute(
	'GET /bundle.js',
	() =>
		new Response(appBundle, {
			headers: { 'content-type': 'application/javascript' },
		}),
)

const appFontsRoute = rooter.makeRoute(
	'GET /fonts.css',
	async () =>
		new Response(await Deno.readTextFile('fonts.css'), {
			headers: { 'content-type': 'text/css' },
		}),
)

const appFontBytesRoute = rooter.makeRoute('GET /fonts/:name', async ({ params }) => {
	const { name } = params
	const file = await Deno.open(`fonts/${name}`)

	return new Response(file.readable, {
		headers: { 'content-type': mediaTypes.contentType(name) || 'application/octet-stream' },
	})
})

const livereloadRoute = rooter.makeRoute('/livereload.ws', ({ request }) => {
	const { response } = Deno.upgradeWebSocket(request)

	return response
})

// const port = Deno.env.get('PORT')

http.serve(
	rooter.makeHandler([
		appTemplateRoute,
		appJsRoute,
		appFontsRoute,
		appFontBytesRoute,
		livereloadRoute,
	]),
	{
		// port,
		onListen({ port }) {
			console.log(`Running example "${example}" at http://localhost:${port}`)
		},
	},
)
