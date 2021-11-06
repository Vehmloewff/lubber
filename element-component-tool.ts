export interface ElementMakerResult {}

export function elementMaker<T = HTMLElement>(type: string, fn: (element: T) => ElementMakerResult) {}
