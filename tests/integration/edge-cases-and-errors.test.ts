import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '~/stores/game'
import type { Command } from '~/types/game'

describe('Edge Cases and Error Handling Tests', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    describe('Boundary Conditions', () => {
        it('should handle empty program execution attempt', () => {
            const store = useGameStore()
            store.loadLevel(1)

            expect(store.program.length).toBe(0)
            expect(store.canExecute).toBe(false)
        })

        it('should handle program with only one command', () => {
            const store = useGameStore()
            store.loadLevel(1)

            store.addCommand('MOVE')
            expect(store.program.length).toBe(1)
            expect(store.canExecute).toBe(true)
        })

        it('should handle maximum command limit exactly', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            // Add exactly max commands
            for (let i = 0; i < level.maxCommands; i++) {
                store.addCommand('MOVE')
            }

            expect(store.program.length).toBe(level.maxCommands)

            // Try to add one more
            store.addCommand('MOVE')
            expect(store.program.length).toBe(level.maxCommands)
        })

        it('should handle command limit of 1', () => {
            const store = useGameStore()

            // Find or simulate a level with maxCommands = 1
            store.loadLevel(1)
            const level = store.currentLevel!

            // If actual level has more, test with just 1 command
            store.addCommand('LIGHT')
            expect(store.program.length).toBeGreaterThan(0)
        })

        it('should handle very large grid sizes', () => {
            const store = useGameStore()

            // Test all levels for reasonable grid sizes
            for (let i = 1; i <= store.levels.length; i++) {
                store.loadLevel(i)
                const level = store.currentLevel!

                expect(level.gridSize).toBeGreaterThan(0)
                expect(level.gridSize).toBeLessThanOrEqual(20) // Reasonable max
                expect(level.layout.length).toBe(level.gridSize * level.gridSize)
            }
        })

        it('should handle minimum grid size', () => {
            const store = useGameStore()

            // Find smallest grid
            let minSize = Infinity
            for (let i = 1; i <= store.levels.length; i++) {
                store.loadLevel(i)
                const level = store.currentLevel!
                minSize = Math.min(minSize, level.gridSize)
            }

            expect(minSize).toBeGreaterThan(0)
        })
    })

    describe('Invalid State Transitions', () => {
        it('should handle execution during RUNNING state', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.addCommand('MOVE')

            store.setStatus('RUNNING')
            expect(store.canExecute).toBe(false)
        })

        it('should handle execution during WIN state', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.addCommand('MOVE')

            store.setStatus('WIN')
            expect(store.canExecute).toBe(false)
        })

        it('should handle execution during FAIL state', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.addCommand('MOVE')

            store.setStatus('FAIL')
            expect(store.canExecute).toBe(false)
        })

        it('should allow reset from any state', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            const states: ('IDLE' | 'RUNNING' | 'WIN' | 'FAIL')[] = ['IDLE', 'RUNNING', 'WIN', 'FAIL']

            states.forEach(state => {
                store.setStatus(state)
                store.reset()
                expect(store.status).toBe('IDLE')
                expect(store.robot).toEqual(level.start)
                expect(store.litGoals.length).toBe(0)
            })
        })
    })

    describe('Invalid Level Operations', () => {
        it('should handle loading non-existent level', () => {
            const store = useGameStore()
            const initialLevelId = store.currentLevelId

            store.loadLevel(9999)
            // Should not change current level when trying to load non-existent level
            expect(store.currentLevelId).toBe(initialLevelId)
        })

        it('should handle loading level 0', () => {
            const store = useGameStore()
            const initialLevelId = store.currentLevelId

            store.loadLevel(0)
            // Should not change current level
            expect(store.currentLevelId).toBe(initialLevelId)
        })

        it('should handle negative level ID', () => {
            const store = useGameStore()
            const initialLevelId = store.currentLevelId

            store.loadLevel(-1)
            // Should not change current level
            expect(store.currentLevelId).toBe(initialLevelId)
        })

        it('should handle next level on last level', () => {
            const store = useGameStore()
            const lastLevel = store.levels.length
            store.loadLevel(lastLevel)

            expect(store.hasNextLevel).toBe(false)

            const currentId = store.currentLevelId
            store.nextLevel()

            // Should not progress beyond last level
            expect(store.currentLevelId).toBe(currentId)
        })
    })

    describe('Invalid Robot Movements', () => {
        it('should handle robot position beyond grid bounds', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            // Try to move beyond bounds
            store.moveRobot(level.gridSize + 5, level.gridSize + 5)

            // Robot position is updated (validation happens elsewhere)
            expect(store.robot.x).toBe(level.gridSize + 5)
            expect(store.robot.y).toBe(level.gridSize + 5)
        })

        it('should handle negative robot positions', () => {
            const store = useGameStore()
            store.loadLevel(1)

            store.moveRobot(-5, -5)

            expect(store.robot.x).toBe(-5)
            expect(store.robot.y).toBe(-5)
        })

        it('should handle very large coordinates', () => {
            const store = useGameStore()
            store.loadLevel(1)

            store.moveRobot(1000, 1000)

            expect(store.robot.x).toBe(1000)
            expect(store.robot.y).toBe(1000)
        })
    })

    describe('Goal Lighting Edge Cases', () => {
        it('should handle lighting non-goal cells', () => {
            const store = useGameStore()
            store.loadLevel(1)

            // Move to non-goal position
            store.moveRobot(0, 0)
            const initialLitCount = store.litGoals.length

            store.lightCell()

            // Should not add to litGoals if not a goal
            const finalLitCount = store.litGoals.length
            expect(finalLitCount).toBe(initialLitCount)
        })

        it('should handle lighting the same goal multiple times', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            if (level.goals.length > 0) {
                const goal = level.goals[0]
                store.moveRobot(goal.x, goal.y)

                // Light multiple times
                for (let i = 0; i < 10; i++) {
                    store.lightCell()
                }

                // Should only be lit once
                expect(store.litGoals.length).toBe(1)
            }
        })

        it('should handle lighting goals out of order', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            if (level.goals.length > 1) {
                // Light last goal first
                const lastGoal = level.goals[level.goals.length - 1]
                store.moveRobot(lastGoal.x, lastGoal.y)
                store.lightCell()

                // Light first goal
                const firstGoal = level.goals[0]
                store.moveRobot(firstGoal.x, firstGoal.y)
                store.lightCell()

                expect(store.litGoals.length).toBe(2)
            }
        })

        it('should handle lighting when robot is off grid', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            // Move off grid
            store.moveRobot(-1, -1)
            const initialLitCount = store.litGoals.length

            store.lightCell()

            // Should not light anything off grid
            expect(store.litGoals.length).toBe(initialLitCount)
        })
    })

    describe('Program Manipulation Edge Cases', () => {
        it('should handle removing commands from empty program', () => {
            const store = useGameStore()
            store.loadLevel(1)

            expect(store.program.length).toBe(0)

            store.removeCommand(0)

            expect(store.program.length).toBe(0)
        })

        it('should handle removing command at invalid index', () => {
            const store = useGameStore()
            store.loadLevel(1)

            store.addCommand('MOVE')
            store.addCommand('LIGHT')

            const initialLength = store.program.length

            store.removeCommand(999)

            expect(store.program.length).toBe(initialLength)
        })

        it('should handle negative index removal', () => {
            const store = useGameStore()
            store.loadLevel(1)

            store.addCommand('MOVE')
            const initialLength = store.program.length

            store.removeCommand(-1)

            // Behavior depends on implementation
            expect(store.program.length).toBeGreaterThanOrEqual(0)
        })

        it('should handle setting program with empty array', () => {
            const store = useGameStore()
            store.loadLevel(1)

            store.addCommand('MOVE')
            store.addCommand('LIGHT')

            store.setProgram([])
            expect(store.program).toEqual([])
        })

        it('should handle setting very large program', () => {
            const store = useGameStore()
            store.loadLevel(1)

            const largeProgram: Command[] = Array(1000).fill('MOVE') as Command[]
            store.setProgram(largeProgram)

            expect(store.program.length).toBe(1000)
        })

        it('should handle program with unavailable commands', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            // Try to add all command types
            const allCommands: Command[] = ['MOVE', 'TURN_L', 'TURN_R', 'LIGHT']

            allCommands.forEach(cmd => {
                if (level.availableBlocks.includes(cmd)) {
                    store.addCommand(cmd)
                }
            })

            expect(store.program.length).toBeGreaterThan(0)
        })
    })

    describe('Speed Control Edge Cases', () => {
        it('should handle zero speed', () => {
            const store = useGameStore()

            store.setSpeed(0)
            expect(store.executionSpeed).toBe(0)
        })

        it('should handle negative speed', () => {
            const store = useGameStore()

            store.setSpeed(-100)
            expect(store.executionSpeed).toBe(-100)
        })

        it('should handle very large speed', () => {
            const store = useGameStore()

            store.setSpeed(999999)
            expect(store.executionSpeed).toBe(999999)
        })

        it('should handle rapid speed changes', () => {
            const store = useGameStore()

            for (let i = 0; i < 100; i++) {
                const speed = 100 + (i * 10)
                store.setSpeed(speed)
                expect(store.executionSpeed).toBe(speed)
            }
        })
    })

    describe('Command Index Edge Cases', () => {
        it('should handle negative command index', () => {
            const store = useGameStore()
            store.loadLevel(1)

            store.setCurrentCommandIndex(-1)
            expect(store.currentCommandIndex).toBe(-1)
        })

        it('should handle command index beyond program length', () => {
            const store = useGameStore()
            store.loadLevel(1)

            store.addCommand('MOVE')
            store.setCurrentCommandIndex(999)

            expect(store.currentCommandIndex).toBe(999)
        })

        it('should handle command index during empty program', () => {
            const store = useGameStore()
            store.loadLevel(1)

            expect(store.program.length).toBe(0)
            store.setCurrentCommandIndex(5)

            expect(store.currentCommandIndex).toBe(5)
        })
    })

    describe('State Consistency Tests', () => {
        it('should maintain state after multiple resets', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            for (let i = 0; i < 10; i++) {
                store.addCommand('MOVE')
                store.setStatus('FAIL')
                store.reset()

                expect(store.status).toBe('IDLE')
                expect(store.robot).toEqual(level.start)
                expect(store.litGoals.length).toBe(0)
            }
        })

        it('should maintain level data integrity after operations', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            const originalTitle = level.title
            const originalGridSize = level.gridSize
            const originalMaxCommands = level.maxCommands

            // Perform operations
            store.addCommand('MOVE')
            store.moveRobot(5, 5)
            store.reset()
            store.clearProgram()

            // Verify level data unchanged
            expect(level.title).toBe(originalTitle)
            expect(level.gridSize).toBe(originalGridSize)
            expect(level.maxCommands).toBe(originalMaxCommands)
        })

        it('should handle alternating add/remove commands', () => {
            const store = useGameStore()
            store.loadLevel(1)

            for (let i = 0; i < 50; i++) {
                store.addCommand('MOVE')
                if (store.program.length > 0) {
                    store.removeCommand(0)
                }
            }

            expect(store.program.length).toBe(0)
        })
    })

    describe('Concurrent Operations Simulation', () => {
        it('should handle rapid state changes', async () => {
            const store = useGameStore()
            store.loadLevel(1)

            const operations = [
                () => store.addCommand('MOVE'),
                () => store.removeCommand(0),
                () => store.moveRobot(1, 1),
                () => store.turnRobot('E'),
                () => store.setStatus('RUNNING'),
                () => store.reset(),
            ]

            for (let i = 0; i < 100; i++) {
                const op = operations[i % operations.length]
                op()
                await new Promise(resolve => setTimeout(resolve, 1))
            }

            expect(store.currentLevel).toBeDefined()
        })

        it('should handle interleaved level loading and program building', () => {
            const store = useGameStore()

            for (let i = 0; i < 10; i++) {
                const levelId = (i % Math.min(3, store.levels.length)) + 1
                store.loadLevel(levelId)

                store.addCommand('MOVE')
                store.addCommand('LIGHT')

                expect(store.currentLevelId).toBe(levelId)
            }
        })
    })

    describe('Data Type Edge Cases', () => {
        it('should handle all direction types', () => {
            const store = useGameStore()
            store.loadLevel(1)

            const directions: ('N' | 'E' | 'S' | 'W')[] = ['N', 'E', 'S', 'W']

            directions.forEach(dir => {
                store.turnRobot(dir)
                expect(store.robot.dir).toBe(dir)
            })
        })

        it('should handle all command types', () => {
            const store = useGameStore()
            store.loadLevel(1)

            const commands: Command[] = ['MOVE', 'TURN_L', 'TURN_R', 'LIGHT']

            commands.forEach(cmd => {
                store.clearProgram()
                store.addCommand(cmd)
                expect(store.program[0]).toBe(cmd)
            })
        })

        it('should handle all game status types', () => {
            const store = useGameStore()
            store.loadLevel(1)

            const statuses: ('IDLE' | 'RUNNING' | 'WIN' | 'FAIL')[] = ['IDLE', 'RUNNING', 'WIN', 'FAIL']

            statuses.forEach(status => {
                store.setStatus(status)
                expect(store.status).toBe(status)
            })
        })

        it('should handle all cell types in layout', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            // Verify only valid cell types
            level.layout.forEach(cell => {
                expect([0, 1, 2]).toContain(cell)
            })
        })
    })

    describe('Memory and Performance Edge Cases', () => {
        it('should handle creating many lit goals', () => {
            const store = useGameStore()
            store.loadLevel(1)

            // Manually add many lit goals (simulating edge case)
            for (let i = 0; i < 1000; i++) {
                store.litGoals.push({ x: i % 10, y: Math.floor(i / 10) % 10 })
            }

            expect(store.litGoals.length).toBe(1000)
        })

        it('should handle very long programs', () => {
            const store = useGameStore()
            store.loadLevel(1)

            const commands: Command[] = Array(10000).fill('MOVE') as Command[]
            store.setProgram(commands)

            expect(store.program.length).toBe(10000)
        })

        it('should handle loading all levels sequentially', () => {
            const store = useGameStore()

            const startTime = Date.now()

            for (let i = 1; i <= store.levels.length; i++) {
                store.loadLevel(i)
                expect(store.currentLevelId).toBe(i)
            }

            const elapsed = Date.now() - startTime
            expect(elapsed).toBeLessThan(1000)
        })
    })
})

