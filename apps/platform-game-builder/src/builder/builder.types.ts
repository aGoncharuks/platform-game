export type GameLevel = string[];

export interface GameElement {
  type: string | object,
  key: string
}

export interface GameElementCoordinates {
  x: number,
  y: number
}

export interface BuilderState {
  levels: GameLevel[],
  selectedLevelIndex: number,
  selectedElement: GameElement | undefined,
  showPreview: boolean
}
