import { Block } from './Block.ts'
import { LifecycleListeners, makeComponent, makeElementUser } from './deps.ts'

export type ImageFit =
	| 'contain'
	| 'cover'
	| 'fill'
	| 'none'
	| 'scale_down'

export type ImagePosition =
	| 'bottom'
	| 'center'
	| 'left'
	| 'bottom_left'
	| 'top_left'
	| 'right'
	| 'bottom_right'
	| 'top_right'
	| 'top'

export interface ImageProps {
	onLoadingDone?(): void
	fit?: ImageFit
	position?: ImagePosition
}

export function Image(url: string | null, props: ImageProps = {}) {
	const { $, render, use } = makeComponent()

	let element: HTMLElement | null = null
	let img: HTMLImageElement | null = null

	let fit = props.fit || 'scale_down'
	let position = props.position || 'top_left'

	use(makeElementUser((e) => element = e))

	use(
		new LifecycleListeners({
			onMounted() {
				setUrl(url)
			},
		}),
	)

	render(Block())

	function styleImg() {
		if (!img) throw new Error('Cannot style img because it isn\'t defined')

		img.style.objectFit = fit.replace('_', '-')
		img.style.position = position.replace('_', ' ')
		img.style.width = '100%'
		img.style.height = '100%'
	}

	function createImg() {
		if (!element) throw new Error('Cannot create img because the component has not mounted yet')

		img = document.createElement('img')

		img.draggable = false
		img.style.userSelect = 'none'

		img.addEventListener('load', () => {
			if (props.onLoadingDone) props.onLoadingDone()
		})
		styleImg()

		element.appendChild(img)

		return img
	}

	function setUrl(newUrl: string | null) {
		if (!element) {
			if (newUrl) url = newUrl

			return
		}

		if (!newUrl) {
			if (img) img.remove()

			return
		}

		if (!img) img = createImg()

		img.src = newUrl
	}

	function setFit(newFit: ImageFit) {
		fit = newFit
		styleImg()
	}

	function setPosition(newPosition: ImagePosition) {
		position = newPosition
		styleImg()
	}

	return { $, setUrl, setFit, setPosition }
}
