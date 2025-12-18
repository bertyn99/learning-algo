import { defineStore } from 'pinia'
import type { Level, Robot, Command, BlockType, ProgramBlock, GameStatus, Position } from '~/types/game'
import levelsData from '~/data/levels.json'

export const useGameStore = defineStore('game', {
    state: () => ({
        // Deep clone levelsData to avoid cross-test contamination and ensure fresh levels
        levels: JSON.parse(JSON.stringify(levelsData)) as Level[],
        currentLevelId: 1,
        robot: {
            x: 0,
            y: 0,
            dir: 'N' as const
        } as Robot,
        program: [] as ProgramBlock[],
        status: 'IDLE' as GameStatus,
        litGoals: [] as Position[],
        executionSpeed: 500,
        currentCommandIndex: -1,
        activeAction: null as Command | null,
        interactiveState: {} as Record<string, boolean>
    }),

    getters: {
        currentLevel(state): Level | undefined {
            return state.levels.find(l => l.id === state.currentLevelId)
        },

        isWin(state): boolean {
            const level = this.currentLevel
            if (!level) return false

            // Vérifie que tous les objectifs ont été allumés
            return level.goals.every(goal =>
                state.litGoals.some(lit => lit.x === goal.x && lit.y === goal.y)
            )
        },

        canExecute(state): boolean {
            return state.status === 'IDLE' && state.program.length > 0
        },

        programLength(state): number {
            const countBlocks = (blocks: ProgramBlock[]): number => {
                let count = 0
                for (const block of blocks) {
                    count++
                    if (block.children) {
                        count += countBlocks(block.children)
                    }
                }
                return count
            }
            return countBlocks(state.program)
        },

        hasNextLevel(state): boolean {
            return state.currentLevelId < state.levels.length
        }
    },

    actions: {
        loadLevel(levelId: number) {
            // When loading a level, we should ideally also reset its layout to the original if it was modified
            // but for now, since we deep clone levelsData on state creation and recreate Pinia in beforeEach, 
            // it should be fine.
            const level = this.levels.find(l => l.id === levelId)
            if (!level) return

            this.currentLevelId = levelId
            this.robot = { ...level.start }
            this.program = []
            this.status = 'IDLE'
            this.litGoals = []
            this.currentCommandIndex = -1
            this.initInteractiveState()
        },

        nextLevel() {
            if (this.hasNextLevel) {
                this.loadLevel(this.currentLevelId + 1)
            }
        },

        initInteractiveState() {
            const level = this.currentLevel
            if (!level) return

            const initialState: Record<string, boolean> = {}
            level.layout.forEach(tile => {
                if (tile.id && tile.state !== undefined) {
                    initialState[tile.id] = tile.state
                }
            })
            this.interactiveState = initialState
        },

        setInteractiveState(id: string, state: boolean) {
            this.interactiveState[id] = state
        },

        setProgram(blocks: ProgramBlock[]) {
            this.program = [...blocks]
        },

        addCommand(command: Command | BlockType) {
            const level = this.currentLevel
            if (!level) return

            if (this.programLength < level.maxCommands) {
                const block: ProgramBlock = {
                    id: Math.random().toString(36).substring(2, 9),
                    type: ['LOOP', 'IF_COLOR'].includes(command) ? (command as BlockType) : 'COMMAND',
                    command: !['LOOP', 'IF_COLOR'].includes(command) ? (command as Command) : undefined,
                    children: ['LOOP', 'IF_COLOR'].includes(command) ? [] : undefined,
                    iterations: command === 'LOOP' ? 2 : undefined,
                    conditionColor: command === 'IF_COLOR' ? 'red' : undefined
                }
                this.program.push(block)
            }
        },

        removeCommand(id: string) {
            const removeRecursive = (blocks: ProgramBlock[]): boolean => {
                const index = blocks.findIndex(b => b.id === id)
                if (index !== -1) {
                    blocks.splice(index, 1)
                    return true
                }
                for (const block of blocks) {
                    if (block.children && removeRecursive(block.children)) {
                        return true
                    }
                }
                return false
            }
            removeRecursive(this.program)
        },

        clearProgram() {
            this.program = []
        },

        setStatus(status: GameStatus) {
            this.status = status
        },

        setCurrentCommandIndex(index: number) {
            this.currentCommandIndex = index
        },

        setActiveAction(action: Command | null) {
            this.activeAction = action
        },

        moveRobot(x: number, y: number) {
            this.robot.x = x
            this.robot.y = y
        },

        turnRobot(direction: Direction) {
            this.robot.dir = direction
        },

        lightCell() {
            const { x, y } = this.robot
            const level = this.currentLevel
            if (!level) return

            // Vérifie si c'est un objectif
            const isGoal = level.goals.some(goal => goal.x === x && goal.y === y)

            if (isGoal) {
                // Ajoute à litGoals si pas déjà allumé
                const alreadyLit = this.litGoals.some(lit => lit.x === x && lit.y === y)
                if (!alreadyLit) {
                    this.litGoals.push({ x, y })
                }
            }
        },

        reset() {
            const level = this.currentLevel
            if (!level) return

            this.robot = { ...level.start }
            this.status = 'IDLE'
            this.litGoals = []
            this.currentCommandIndex = -1
            this.initInteractiveState()
        },

        resetPosition() {
            const level = this.currentLevel
            if (!level) return

            this.robot = { ...level.start }
            this.litGoals = []
            this.currentCommandIndex = -1
            this.initInteractiveState()
        },

        setSpeed(speed: number) {
            this.executionSpeed = speed
        }
    }
})
