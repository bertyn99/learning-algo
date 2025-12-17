export type Direction = 'N' | 'E' | 'S' | 'W'
export type Command = 'MOVE' | 'TURN_L' | 'TURN_R' | 'LIGHT'
export type CellType = 0 | 1 | 2 // 0: vide, 1: sol, 2: cible
export type GameStatus = 'IDLE' | 'RUNNING' | 'WIN' | 'FAIL'

export interface Position {
    x: number
    y: number
}

export interface Robot {
    x: number
    y: number
    dir: Direction
}

export interface Level {
    id: number
    title: string
    description: string
    gridSize: number
    layout: CellType[]
    start: { x: number; y: number; dir: Direction }
    goals: Position[]
    availableBlocks: Command[]
    maxCommands: number
}

export interface GameState {
    currentLevelId: number
    robot: Robot
    program: Command[]
    status: GameStatus
    litGoals: Position[]
    executionSpeed: number
    currentCommandIndex: number
}

