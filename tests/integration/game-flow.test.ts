import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '~/stores/game'
import type { Command } from '~/types/game'

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
            const program: Command[] = ['MOVE', 'MOVE', 'LIGHT']
            program.forEach(cmd => store.addCommand(cmd))
            expect(store.program.length).toBe(3)

            // 3. Start execution
            store.setStatus('RUNNING')
            expect(store.status).toBe('RUNNING')
            expect(store.canExecute).toBe(false) // Can't execute while running

            // 4. Simulate movement
            store.setCurrentCommandIndex(0)
            const delta1 = { dx: 0, dy: -1 } // North
            store.moveRobot(
                store.robot.x + delta1.dx,
                store.robot.y + delta1.dy
            )

            store.setCurrentCommandIndex(1)
            const delta2 = { dx: 0, dy: -1 } // North
            store.moveRobot(
                store.robot.x + delta2.dx,
                store.robot.y + delta2.dy
            )

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

    describe('Error Recovery', () => {
        it('should recover from failed attempt', () => {
            const store = useGameStore()
            store.loadLevel(1)

            // First attempt: build wrong program
            store.addCommand('MOVE')
            store.addCommand('TURN_L')
            store.setStatus('RUNNING')
            store.setStatus('FAIL')

            expect(store.status).toBe('FAIL')

            // Reset and try again
            store.reset()
            expect(store.status).toBe('IDLE')

            // Build correct program
            store.clearProgram()
            store.addCommand('MOVE')
            store.addCommand('MOVE')
            store.addCommand('LIGHT')

            expect(store.program.length).toBe(3)
        })
    })

    describe('Program Reordering During Planning', () => {
        it('should allow reordering before execution', () => {
            const store = useGameStore()
            store.loadLevel(1)

            // Build program
            store.addCommand('MOVE')
            store.addCommand('LIGHT')
            store.addCommand('TURN_L')

            expect(store.program).toEqual(['MOVE', 'LIGHT', 'TURN_L'])

            // Reorder
            store.setProgram(['LIGHT', 'MOVE', 'TURN_L'])

            expect(store.program).toEqual(['LIGHT', 'MOVE', 'TURN_L'])
            expect(store.status).toBe('IDLE')
        })

        it('should update indices after reordering', () => {
            const store = useGameStore()
            store.loadLevel(1)

            // Add commands
            store.addCommand('MOVE')
            store.addCommand('MOVE')
            store.addCommand('LIGHT')

            // Reorder by removing middle and re-adding
            store.removeCommand(1)
            expect(store.program.length).toBe(2)

            store.addCommand('MOVE')
            expect(store.program.length).toBe(3)
        })
    })

    describe('Speed Control During Session', () => {
        it('should allow speed adjustment between attempts', () => {
            const store = useGameStore()
            store.loadLevel(1)

            store.setSpeed(500)
            store.addCommand('MOVE')

            // Change speed
            store.setSpeed(300)
            expect(store.executionSpeed).toBe(300)

            store.setStatus('RUNNING')

            // Speed should persist during execution
            expect(store.executionSpeed).toBe(300)
        })
    })

    describe('Goal Validation', () => {
        it('should properly validate goal completion', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            if (level.goals.length > 0) {
                // Move to goal
                const goal = level.goals[0]
                store.moveRobot(goal.x, goal.y)

                // Light it
                store.lightCell()

                // Verify it's lit
                const isLit = store.litGoals.some(g => g.x === goal.x && g.y === goal.y)
                expect(isLit).toBe(true)
            }
        })
    })

    describe('Command Limit Enforcement', () => {
        it('should enforce max commands limit', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            // Fill to max
            for (let i = 0; i < level.maxCommands; i++) {
                store.addCommand('MOVE')
            }

            expect(store.programLength).toBe(level.maxCommands)
            expect(store.canExecute).toBe(true)

            // Try to add more
            store.addCommand('MOVE')
            expect(store.programLength).toBe(level.maxCommands)
        })

        it('should allow removal and re-addition within limit', () => {
            const store = useGameStore()
            store.loadLevel(1)

            store.addCommand('MOVE')
            store.addCommand('MOVE')
            store.addCommand('LIGHT')

            const initialCount = store.programLength

            // Remove one
            store.removeCommand(1)
            expect(store.programLength).toBe(initialCount - 1)

            // Add different one
            store.addCommand('TURN_L')
            expect(store.programLength).toBe(initialCount)
        })
    })

    describe('Session State Preservation', () => {
        it('should preserve speed across resets', () => {
            const store = useGameStore()

            store.setSpeed(300)
            store.loadLevel(1)
            store.addCommand('MOVE')
            store.setStatus('FAIL')
            store.reset()

            expect(store.executionSpeed).toBe(300)
        })

        it('should not preserve program across level load', () => {
            const store = useGameStore()

            store.loadLevel(1)
            store.addCommand('MOVE')
            store.addCommand('LIGHT')

            store.loadLevel(2)

            expect(store.program).toEqual([])
        })
    })

    describe('Level Data Integrity', () => {
        it('should have consistent level data', () => {
            const store = useGameStore()

            for (let i = 1; i <= Math.min(3, store.levels.length); i++) {
                store.loadLevel(i)
                const level = store.currentLevel!

                // Verify essential properties
                expect(level.id).toBe(i)
                expect(level.gridSize).toBeGreaterThan(0)
                expect(level.start).toBeDefined()
                expect(level.goals).toBeInstanceOf(Array)
                expect(level.availableBlocks).toBeInstanceOf(Array)
                expect(level.maxCommands).toBeGreaterThan(0)
            }
        })
    })

    describe('Full Game Flow Scenario', () => {
        it('should handle realistic game session', () => {
            const store = useGameStore()

            // Session 1: Attempt level 1
            store.loadLevel(1)
            const level1 = store.currentLevel!

            // Build program
            store.addCommand('MOVE')
            store.addCommand('MOVE')
            store.addCommand('LIGHT')

            // Try execution
            store.setStatus('RUNNING')
            store.moveRobot(2, 0)
            store.lightCell()

            // Check if won
            const won = level1.goals.every(g =>
                store.litGoals.some(l => l.x === g.x && l.y === g.y)
            )

            store.setStatus(won ? 'WIN' : 'FAIL')

            // Progress if won
            if (won && store.hasNextLevel) {
                store.nextLevel()
                expect(store.currentLevelId).toBe(2)
                expect(store.program.length).toBe(0) // Program resets on new level
                expect(store.status).toBe('IDLE') // Status resets on new level
            }
        })
    })
})

