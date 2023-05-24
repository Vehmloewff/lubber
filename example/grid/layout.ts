import { GridItemPosition } from './types.ts'

export interface InferGridOptions {
	minPaddingY?: number
	minPaddingX?: number
	minCellWidth?: number
	minCellHeight?: number
}

export interface GridLayout {
	cellCountX: number
	cellCountY: number
	cellWidth: number
	cellHeight: number
	paddingXSize: number
	paddingYSize: number
}

export function inferGridLayout(width: number, height: number, options: InferGridOptions = {}): GridLayout {
	const minPaddingX = options.minPaddingX ?? 15
	const minPaddingY = options.minPaddingY ?? 30
	const minCellWidth = options.minCellWidth ?? 60
	const minCellHeight = options.minCellHeight ?? 60

	// We will always need to subtract one more padding than cells in a particular direction
	const spaceX = width - minPaddingX
	const spaceY = height - minPaddingY

	const cellSpaceX = minCellWidth + minPaddingX
	const cellSpaceY = minCellHeight + minPaddingY

	// Using the minimum space, try to get the most cells we could fit
	const cellCountX = Math.floor(spaceX / cellSpaceX)
	const cellCountY = Math.floor(spaceY / cellSpaceY)

	// expansionSpace is the space that the cells or padding should expand
	const extraSpaceX = spaceX % cellSpaceX
	const extraSpaceY = spaceY % cellSpaceY
	const expansionSpaceX = extraSpaceX // / 2
	const expansionSpaceY = extraSpaceY // / 2

	// const addedCellSizeX = expansionSpaceX / cellCountX
	// const addedCellSizeY = expansionSpaceY / cellCountY
	const addedPaddingSizeX = expansionSpaceX / (cellCountX + 1)
	const addedPaddingSizeY = expansionSpaceY / (cellCountY + 1)

	const cellWidth = minCellWidth //+ addedCellSizeX
	const cellHeight = minCellHeight // + addedCellSizeY

	const paddingXSize = minPaddingX + addedPaddingSizeX
	const paddingYSize = minPaddingY + addedPaddingSizeY

	return { cellCountX, cellCountY, cellWidth, cellHeight, paddingXSize, paddingYSize }
}

export interface GetPositionParams {
	layout: GridLayout
	x: number
	y: number
	spanX: number
	spanY: number
}

export function getPosition(params: GetPositionParams): GridItemPosition {
	const posY = params.layout.paddingYSize + (params.layout.cellHeight + params.layout.paddingYSize) * params.y
	const posX = params.layout.paddingXSize + (params.layout.cellWidth + params.layout.paddingXSize) * params.x

	const cellSpanX = params.layout.cellWidth * params.spanX
	const cellSpanY = params.layout.cellHeight * params.spanY
	const paddingSpanX = params.layout.paddingXSize * (params.spanX - 1)
	const paddingSpanY = params.layout.paddingYSize * (params.spanY - 1)

	return {
		posX,
		posY,
		width: cellSpanX + paddingSpanX,
		height: cellSpanY + paddingSpanY,
	}
}
