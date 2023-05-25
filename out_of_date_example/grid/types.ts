export interface CellReference {
	x: number
	y: number
}

export interface GridWidget {
	startCell: CellReference
	spanX: number
	spanY: number
	id: string
}

export interface PhysicalCell {
	reference: CellReference
	posX: number
	posY: number
}

export interface GridItemPosition {
	posX: number
	posY: number
	width: number
	height: number
}
