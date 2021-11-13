export interface Context {
	setKey(id: string, value: unknown): void
	getKey(id: string): unknown | null
	setObject(rootId: string, object: Record<string, unknown>): void
	getObject(rootId: string): unknown
}

export function makeContext(inheritFrom?: Context): Context {
	const keys: Record<string, unknown> = {}

	function setKey(id: string, value: unknown) {
		keys[id] = value
	}

	function getKey(id: string) {
		const value = keys[id]
		if (value) return value

		if (!inheritFrom) return null

		return inheritFrom.getKey(id)
	}

	function setObject(rootId: string, object: Record<string, unknown>) {
		for (const id in object) setKey(`${rootId}.${id}`, object[id])
	}

	function getObject(rootId: string) {
		const object: Record<string, unknown> = inheritFrom ? (inheritFrom?.getObject(rootId) as Record<string, unknown>) : {}

		for (const id in keys) {
			if (!id.startsWith(`${rootId}.`)) continue

			const objectId = id.slice(rootId.length + 1)
			if (objectId.indexOf('.') !== -1) continue

			object[objectId] = keys[id]
		}

		return object
	}

	return { setKey, getKey, setObject, getObject }
}
