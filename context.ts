export interface Context {
	setKey(id: string, value: unknown): void
	getKey(id: string): unknown | null
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

	return { setKey, getKey }
}
