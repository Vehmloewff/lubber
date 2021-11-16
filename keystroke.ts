export interface KeystrokeListenerParams {
	onCharacter?(character: string): unknown
	onShift?(): unknown
	onMeta?(): unknown
	onAlt?(): unknown
	onControl?(): unknown
	onEnter?(): unknown
	onDelete?(): unknown
	onArrowUp?(): unknown
	onArrowRight?(): unknown
	onArrowLeft?(): unknown
	onArrowDown?(): unknown
	onTab?(): unknown
	onOther?(id: string): unknown
}

export function keystrokeListener(params: KeystrokeListenerParams) {
	const listener = (event: KeyboardEvent) => {
		event.preventDefault()

		if (event.key.length === 1) {
			if (params.onCharacter) params.onCharacter(event.key)
		} else if (event.key === 'ArrowUp') {
			if (params.onArrowUp) params.onArrowUp()
		} else if (event.key === 'ArrowDown') {
			if (params.onArrowDown) params.onArrowDown()
		} else if (event.key === 'ArrowLeft') {
			if (params.onArrowLeft) params.onArrowLeft()
		} else if (event.key === 'ArrowRight') {
			if (params.onArrowRight) params.onArrowRight()
		} else if (event.key === 'Delete' || event.key === 'Backspace') {
			if (params.onDelete) params.onDelete()
		} else if (event.key === 'Shift') {
			if (params.onShift) params.onShift()
		} else if (event.key === 'Meta') {
			if (params.onMeta) params.onMeta()
		} else if (event.key === 'Alt') {
			if (params.onAlt) params.onAlt()
		} else if (event.key === 'Control') {
			if (params.onControl) params.onControl()
		} else if (event.key === 'Enter' || event.key === 'Return') {
			if (params.onEnter) params.onEnter()
		} else if (event.key === 'Tab') {
			if (params.onTab) params.onTab()
		} else {
			if (params.onOther) params.onOther(event.key)
		}
	}

	document.addEventListener('keydown', listener)

	return () => document.removeEventListener('keydown', listener)
}
