let wasDisconnected = false

function connect() {
	const socket = new WebSocket(`ws://${location.host}/livereload.ws`)

	if (wasDisconnected) {
		socket.onopen = () => location.reload()
	}

	socket.onclose = () => {
		console.log('Livereload socket, closed. Reconnecting in 1s')
		wasDisconnected = true
		setTimeout(connect, 100)
	}
}

if (location.hostname === 'localhost') connect()
