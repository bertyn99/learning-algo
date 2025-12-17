import { defineStore } from 'pinia'
import type { Level, Robot, Command, GameStatus, Position } from '~/types/game'
import levelsData from '~/data/levels.json'

export const useGameStore = defineStore('game', {
    state: () => ({
        levels: levelsData as Level[],
        currentLevelId: 1,
        robot: {
            x: 0,
            y: 0,
            dir: 'N' as const
        } as Robot,
        program: [] as Command[],
        status: 'IDLE' as GameStatus,
        litGoals: [] as Position[],
        executionSpeed: 500,
        currentCommandIndex: -1
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
            return state.program.length
        },

        hasNextLevel(state): boolean {
            return state.currentLevelId < state.levels.length
        }
    },

    actions: {
        loadLevel(levelId: number) {
            const level = this.levels.find(l => l.id === levelId)
            if (!level) return

            this.currentLevelId = levelId
            this.robot = { ...level.start }
            this.program = []
            this.status = 'IDLE'
            this.litGoals = []
            this.currentCommandIndex = -1
        },

        nextLevel() {
            if (this.hasNextLevel) {
                this.loadLevel(this.currentLevelId + 1)
            }
        },

        setProgram(commands: Command[]) {
            this.program = [...commands]
        },

        addCommand(command: Command) {
            const level = this.currentLevel
            if (!level) return

            if (this.program.length < level.maxCommands) {
                this.program.push(command)
            }
        },

        removeCommand(index: number) {
            this.program.splice(index, 1)
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

        moveRobot(x: number, y: number) {
            this.robot.x = x
            this.robot.y = y
        },

        turnRobot(direction: 'N' | 'E' | 'S' | 'W') {
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
        },

        setSpeed(speed: number) {
            this.executionSpeed = speed
        }
    }
})

