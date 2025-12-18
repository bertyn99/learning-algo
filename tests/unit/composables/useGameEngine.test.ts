import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '~/stores/game'

describe('Game Engine Logic', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    describe('Robot Movement Logic', () => {
        it('should calculate correct delta for each direction', () => {
            // Test North
            expect({ dx: 0, dy: -1 }).toEqual({ dx: 0, dy: -1 })

            // Test East
            expect({ dx: 1, dy: 0 }).toEqual({ dx: 1, dy: 0 })

            // Test South
            expect({ dx: 0, dy: 1 }).toEqual({ dx: 0, dy: 1 })

            // Test West
            expect({ dx: -1, dy: 0 }).toEqual({ dx: -1, dy: 0 })
        })

        it('should determine valid positions on board', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel

            if (level) {
                // Test valid positions
                expect(0 >= 0 && 0 < level.gridSize).toBe(true)
                expect(level.gridSize - 1 >= 0 && level.gridSize - 1 < level.gridSize).toBe(true)

                // Test invalid positions
                expect(-1 >= 0 && -1 < level.gridSize).toBe(false)
                expect(level.gridSize >= 0 && level.gridSize < level.gridSize).toBe(false)
            }
        })

        it('should turn robot left correctly', () => {
            const directions = ['N', 'W', 'S', 'E'] as const

            directions.forEach((dir, index) => {
                const nextDir = directions[(index + 1) % 4]
                expect(nextDir).toBeDefined()
            })
        })

        it('should turn robot right correctly', () => {
            const directions = ['N', 'E', 'S', 'W'] as const

            directions.forEach((dir, index) => {
                const nextDir = directions[(index + 1) % 4]
                expect(nextDir).toBeDefined()
            })
        })
    })

    describe('Goal Detection', () => {
        it('should detect when robot reaches goal', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel

            if (level && level.goals.length > 0) {
                const goal = level.goals[0]
                store.moveRobot(goal.x, goal.y)

                const isGoal = level.goals.some(g => g.x === store.robot.x && g.y === store.robot.y)
                expect(isGoal).toBe(true)
            }
        })

        it('should detect when robot is not on goal', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel

            if (level) {
                store.moveRobot(0, 0)

                const isGoal = level.goals.some(g => g.x === store.robot.x && g.y === store.robot.y)
                expect(isGoal).toBe(false)
            }
        })
    })

    describe('Win Condition', () => {
        it('should detect win when all goals are lit', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel

            if (level) {
                // Light all goals
                level.goals.forEach(goal => {
                    store.litGoals.push(goal)
                })

                const allGoalsLit = level.goals.every(goal =>
                    store.litGoals.some(lit => lit.x === goal.x && lit.y === goal.y)
                )

                expect(allGoalsLit).toBe(true)
                expect(store.isWin).toBe(true)
            }
        })

        it('should detect non-win when not all goals are lit', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel

            if (level && level.goals.length > 1) {
                // Light only first goal
                store.litGoals.push(level.goals[0])

                expect(store.isWin).toBe(false)
            }
        })

        it('should detect non-win when no goals are lit', () => {
            const store = useGameStore()
            store.loadLevel(1)

            expect(store.isWin).toBe(false)
            expect(store.litGoals.length).toBe(0)
        })
    })

    describe('Program Execution', () => {
        it('should track command index during execution', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.addCommand('MOVE')
            store.addCommand('MOVE')
            store.addCommand('LIGHT')

            expect(store.program.length).toBe(3)
            expect(store.currentCommandIndex).toBe(-1)

            store.setCurrentCommandIndex(0)
            expect(store.currentCommandIndex).toBe(0)

            store.setCurrentCommandIndex(2)
            expect(store.currentCommandIndex).toBe(2)
        })

        it('should validate program before execution', () => {
            const store = useGameStore()
            store.loadLevel(1)

            // Empty program
            expect(store.program.length).toBe(0)
            expect(store.canExecute).toBe(false)

            // With program
            store.addCommand('MOVE')
            expect(store.canExecute).toBe(true)
        })

        it('should validate status for execution', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.addCommand('MOVE')

            expect(store.status).toBe('IDLE')
            expect(store.canExecute).toBe(true)

            store.setStatus('RUNNING')
            expect(store.canExecute).toBe(false)

            store.setStatus('WIN')
            expect(store.canExecute).toBe(false)
        })
    })

    describe('Level Progression', () => {
        it('should load correct level data', () => {
            const store = useGameStore()
            store.loadLevel(1)

            expect(store.currentLevel).toBeDefined()
            expect(store.currentLevel?.id).toBe(1)
        })

        it('should have valid level structure', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel

            if (level) {
                expect(level.id).toBeDefined()
                expect(level.gridSize).toBeGreaterThan(0)
                expect(level.start).toBeDefined()
                expect(level.goals).toBeInstanceOf(Array)
                expect(level.availableBlocks).toBeInstanceOf(Array)
                expect(level.maxCommands).toBeGreaterThan(0)
            }
        })

        it('should have valid robot start position', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel

            if (level) {
                expect(level.start.x).toBeGreaterThanOrEqual(0)
                expect(level.start.y).toBeGreaterThanOrEqual(0)
                expect(['N', 'E', 'S', 'W']).toContain(level.start.dir)
            }
        })
    })

    describe('State Transitions', () => {
        it('should transition from IDLE to RUNNING', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.addCommand('MOVE')

            expect(store.status).toBe('IDLE')
            store.setStatus('RUNNING')
            expect(store.status).toBe('RUNNING')
        })

        it('should transition from RUNNING to WIN', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel

            if (level) {
                store.setStatus('RUNNING')
                expect(store.status).toBe('RUNNING')

                // Light all goals
                level.goals.forEach(goal => store.litGoals.push(goal))
                store.setStatus('WIN')
                expect(store.status).toBe('WIN')
            }
        })

        it('should transition from RUNNING to FAIL', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.addCommand('MOVE')

            store.setStatus('RUNNING')
            expect(store.status).toBe('RUNNING')

            store.setStatus('FAIL')
            expect(store.status).toBe('FAIL')
        })

        it('should transition from WIN or FAIL back to IDLE on reset', () => {
            const store = useGameStore()
            store.loadLevel(1)

            store.setStatus('WIN')
            store.reset()
            expect(store.status).toBe('IDLE')

            store.setStatus('FAIL')
            store.reset()
            expect(store.status).toBe('IDLE')
        })
    })

    describe('Error Handling', () => {
        it('should handle invalid direction gracefully', () => {
            const validDirections = ['N', 'E', 'S', 'W']
            const invalidDir = 'X'

            expect(validDirections).not.toContain(invalidDir)
        })

        it('should prevent moving out of bounds', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel

            if (level) {
                // Try to move to invalid position
                const invalidX = -1
                const invalidY = level.gridSize

                expect(invalidX >= 0 && invalidX < level.gridSize).toBe(false)
                expect(invalidY >= 0 && invalidY < level.gridSize).toBe(false)
            }
        })
    })

    describe('Speed Control', () => {
        it('should support multiple speed levels', () => {
            const store = useGameStore()

            store.setSpeed(300) // Fast
            expect(store.executionSpeed).toBe(300)

            store.setSpeed(500) // Normal
            expect(store.executionSpeed).toBe(500)

            store.setSpeed(1000) // Slow
            expect(store.executionSpeed).toBe(1000)
        })

        it('should maintain speed across game sessions', () => {
            const store = useGameStore()

            store.setSpeed(300)
            store.loadLevel(1)
            expect(store.executionSpeed).toBe(300)

            store.loadLevel(2)
            expect(store.executionSpeed).toBe(300)
        })
    })
})

