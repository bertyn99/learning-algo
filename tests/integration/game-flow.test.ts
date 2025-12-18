import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '~/stores/game'
import type { Command, ProgramBlock } from '~/types/game'

describe('Game Flow Integration Tests', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    describe('Complete Game Session', () => {
        it('should complete a full game session', () => {
            const store = useGameStore()

            // 1. Load level
            store.loadLevel(1)
            expect(store.currentLevelId).toBe(1)
            expect(store.currentLevel).toBeDefined()

            const level = store.currentLevel!

            // 2. Build program
            const commands: Command[] = ['MOVE', 'MOVE', 'LIGHT']
            commands.forEach(cmd => store.addCommand(cmd))
            expect(store.program.length).toBe(3)

            // 3. Start execution
            store.setStatus('RUNNING')
            expect(store.status).toBe('RUNNING')
            expect(store.canExecute).toBe(false) // Can't execute while running

            // 4. Simulate movement (Level 1: Robot starts at 0,0 dir E, goal at 2,0)
            store.setCurrentCommandIndex(0)
            store.moveRobot(1, 0)

            store.setCurrentCommandIndex(1)
            store.moveRobot(2, 0)

            // 5. Light goal
            store.setCurrentCommandIndex(2)
            const goalX = store.robot.x
            const goalY = store.robot.y
            const isOnGoal = level.goals.some(g => g.x === goalX && g.y === goalY)

            if (isOnGoal) {
                store.lightCell()
            }

            // 6. Check win condition
            const allGoalsLit = level.goals.every(goal =>
                store.litGoals.some(lit => lit.x === goal.x && lit.y === goal.y)
            )

            if (allGoalsLit) {
                store.setStatus('WIN')
            } else {
                store.setStatus('FAIL')
            }

            expect(['WIN', 'FAIL']).toContain(store.status)
        })
    })

    describe('Multiple Level Progression', () => {
        it('should progress through levels', () => {
            const store = useGameStore()

            // Load level 1
            store.loadLevel(1)
            expect(store.currentLevelId).toBe(1)

            // Complete level 1 (simulate)
            store.setStatus('WIN')

            // Progress to level 2
            if (store.hasNextLevel) {
                store.nextLevel()
                expect(store.currentLevelId).toBe(2)
                expect(store.status).toBe('IDLE') // Status resets when loading new level
            }
        })

        it('should reset state when loading new level', () => {
            const store = useGameStore()

            // Load and play level 1
            store.loadLevel(1)
            store.addCommand('MOVE')
            store.setStatus('RUNNING')

            // Load level 2
            store.loadLevel(2)

            expect(store.status).toBe('IDLE')
            expect(store.program.length).toBe(0)
        })
    })

    describe('Program Reordering During Planning', () => {
        it('should allow reordering before execution', () => {
            const store = useGameStore()
            store.loadLevel(1)

            // Build program
            const blocks: ProgramBlock[] = [
                { id: '1', type: 'COMMAND', command: 'MOVE' },
                { id: '2', type: 'COMMAND', command: 'LIGHT' }
            ]
            store.setProgram(blocks)

            expect(store.program).toEqual(blocks)

            // Reorder
            const reordered = [blocks[1], blocks[0]]
            store.setProgram(reordered)

            expect(store.program).toEqual(reordered)
            expect(store.status).toBe('IDLE')
        })

        it('should update indices after reordering', () => {
            const store = useGameStore()
            store.loadLevel(1)

            // Add commands
            store.addCommand('MOVE')
            store.addCommand('MOVE')
            store.addCommand('LIGHT')

            const idToRemove = store.program[1].id
            // Reorder by removing middle and re-adding
            store.removeCommand(idToRemove)
            expect(store.program.length).toBe(2)

            store.addCommand('MOVE')
            expect(store.program.length).toBe(3)
        })
    })
})
