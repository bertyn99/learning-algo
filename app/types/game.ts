export type Direction = 'N' | 'E' | 'S' | 'W'

export type Command = 'MOVE' | 'TURN_L' | 'TURN_R' | 'JUMP' | 'LIGHT' | 'P1'
export type BlockType = 'COMMAND' | 'LOOP' | 'IF_COLOR'

export interface ProgramBlock {
    id: string           // UUID for vuedraggable
    type: BlockType

    // For Simple Commands
    command?: Command

    // For Containers (Loops/Ifs)
    children?: ProgramBlock[] // Recursive nesting
    iterations?: number       // For Loops
    conditionColor?: string   // For If (e.g., 'red')
}

export type TileType = 'ground' | 'void' | 'switch' | 'door' | 'teleport' | 'cracked'

export interface Tile {
    x: number
    y: number
    type: TileType
    height: number       // 0 (ground), 1, 2... (for jumping)
    color?: string       // 'red', 'blue' (for IF_COLOR conditions)

    // Interactive Properties
    id?: string          // Unique ID for linking (e.g., "door_A")
    targetId?: string    // What it triggers (e.g., switch triggers "door_A")
    state?: boolean      // Open/Closed (for doors), Broken/Safe (for cracked tiles)
}

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
    layout: Tile[]
    start: { x: number; y: number; dir: Direction }
    goals: Position[]
    availableBlocks: (Command | BlockType)[]
    maxCommands: number
}

export interface GameState {
    currentLevelId: number
    robot: Robot
    program: ProgramBlock[]
    status: GameStatus
    litGoals: Position[]
    executionSpeed: number
    currentCommandIndex: number
    activeAction: Command | null
    interactiveState: Record<string, boolean>
}
