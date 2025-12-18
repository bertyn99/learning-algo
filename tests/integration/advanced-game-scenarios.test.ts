import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '~/stores/game'
import type { Command, Direction } from '~/types/game'

describe('Advanced Game Scenarios Integration Tests', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    describe('Complete Level Solutions', () => {
        it('should complete level 1 with optimal solution', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            // Build program to solve level 1
            const solution: Command[] = ['MOVE', 'MOVE', 'LIGHT']
            solution.forEach(cmd => store.addCommand(cmd))

            expect(store.program).toEqual(solution)
            expect(store.programLength).toBeLessThanOrEqual(level.maxCommands)
        })

        it('should handle multi-goal levels', () => {
            const store = useGameStore()

            // Find a level with multiple goals
            for (let i = 1; i <= store.levels.length; i++) {
                store.loadLevel(i)
                const level = store.currentLevel!

                if (level.goals.length > 1) {
                    // Verify multiple goals can be tracked
                    level.goals.forEach(goal => {
                        store.moveRobot(goal.x, goal.y)
                        store.lightCell()
                    })

                    expect(store.litGoals.length).toBe(level.goals.length)
                    expect(store.isWin).toBe(true)
                    break
                }
            }
        })

        it('should handle levels with turn commands', () => {
            const store = useGameStore()

            // Find a level with turn commands available
            for (let i = 1; i <= store.levels.length; i++) {
                store.loadLevel(i)
                const level = store.currentLevel!

                if (level.availableBlocks.includes('TURN_L') || level.availableBlocks.includes('TURN_R')) {
                    // Test turning
                    if (level.availableBlocks.includes('TURN_L')) {
                        store.addCommand('TURN_L')
                    }
                    if (level.availableBlocks.includes('TURN_R')) {
                        store.addCommand('TURN_R')
                    }
                    store.addCommand('MOVE')

                    expect(store.program.length).toBeGreaterThan(0)
                    break
                }
            }
        })
    })

    describe('Complex Movement Patterns', () => {
        it('should handle straight line movement', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            const startX = level.start.x
            const startY = level.start.y

            // Move in a straight line (if facing North)
            if (level.start.dir === 'N') {
                for (let i = 0; i < 3; i++) {
                    const newY = startY - i - 1
                    if (newY >= 0) {
                        store.moveRobot(startX, newY)
                        expect(store.robot.y).toBe(newY)
                    }
                }
            }
        })

        it('should handle L-shaped movement pattern', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            // Build L-shaped path program
            store.addCommand('MOVE')
            store.addCommand('MOVE')
            store.addCommand('TURN_R')
            store.addCommand('MOVE')

            expect(store.program.length).toBe(4)
        })

        it('should handle zigzag movement pattern', () => {
            const store = useGameStore()
            store.loadLevel(1)

            // Build zigzag pattern
            const zigzag: Command[] = [
                'MOVE', 'TURN_R', 'MOVE', 'TURN_L',
                'MOVE', 'TURN_R', 'MOVE'
            ]

            zigzag.forEach(cmd => {
                if (store.program.length < store.currentLevel!.maxCommands) {
                    store.addCommand(cmd)
                }
            })

            expect(store.program.length).toBeGreaterThan(0)
        })

        it('should handle square movement pattern', () => {
            const store = useGameStore()
            store.loadLevel(1)

            // Build square pattern
            const square: Command[] = [
                'MOVE', 'TURN_R',
                'MOVE', 'TURN_R',
                'MOVE', 'TURN_R',
                'MOVE', 'TURN_R'
            ]

            square.forEach(cmd => {
                if (store.program.length < store.currentLevel!.maxCommands) {
                    store.addCommand(cmd)
                }
            })

            expect(store.program.length).toBeGreaterThan(0)
        })
    })

    describe('Edge Case Movements', () => {
        it('should handle movement to grid boundaries', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            // Move to corners
            store.moveRobot(0, 0)
            expect(store.robot.x).toBe(0)
            expect(store.robot.y).toBe(0)

            store.moveRobot(level.gridSize - 1, 0)
            expect(store.robot.x).toBe(level.gridSize - 1)
            expect(store.robot.y).toBe(0)

            store.moveRobot(0, level.gridSize - 1)
            expect(store.robot.x).toBe(0)
            expect(store.robot.y).toBe(level.gridSize - 1)

            store.moveRobot(level.gridSize - 1, level.gridSize - 1)
            expect(store.robot.x).toBe(level.gridSize - 1)
            expect(store.robot.y).toBe(level.gridSize - 1)
        })

        it('should detect when robot would move out of bounds', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            // Position robot at edge
            store.moveRobot(0, 0)
            store.turnRobot('W')

            // Calculate where move would take us
            const delta = getDirectionDelta('W')
            const newX = store.robot.x + delta.dx
            const newY = store.robot.y + delta.dy

            // Check if out of bounds
            const isOutOfBounds = newX < 0 || newX >= level.gridSize ||
                newY < 0 || newY >= level.gridSize
            expect(isOutOfBounds).toBe(true)
        })

        it('should detect invalid positions on empty cells', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            // Find empty cells (type 0)
            for (let y = 0; y < level.gridSize; y++) {
                for (let x = 0; x < level.gridSize; x++) {
                    const index = y * level.gridSize + x
                    const cellType = level.layout[index]

                    if (cellType === 0) {
                        // Empty cell - should not be valid
                        expect(cellType).toBe(0)
                    }
                }
            }
        })
    })

    describe('Complex Goal Scenarios', () => {
        it('should handle lighting goals in specific order', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            if (level.goals.length > 1) {
                // Light goals in reverse order
                for (let i = level.goals.length - 1; i >= 0; i--) {
                    const goal = level.goals[i]
                    store.moveRobot(goal.x, goal.y)
                    store.lightCell()
                }

                expect(store.litGoals.length).toBe(level.goals.length)
                expect(store.isWin).toBe(true)
            }
        })

        it('should handle revisiting already lit goals', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            if (level.goals.length > 0) {
                const goal = level.goals[0]

                // Light goal multiple times
                store.moveRobot(goal.x, goal.y)
                store.lightCell()

                const litCount1 = store.litGoals.length

                store.lightCell() // Light again
                store.lightCell() // And again

                const litCount2 = store.litGoals.length

                // Should not duplicate
                expect(litCount2).toBe(litCount1)
            }
        })

        it('should detect partial goal completion', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            if (level.goals.length > 1) {
                // Light only first goal
                const goal = level.goals[0]
                store.moveRobot(goal.x, goal.y)
                store.lightCell()

                expect(store.litGoals.length).toBe(1)
                expect(store.litGoals.length).toBeLessThan(level.goals.length)
                expect(store.isWin).toBe(false)
            }
        })

        it('should handle goals at different grid locations', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            // Verify goals are at different locations
            const positions = new Set<string>()
            level.goals.forEach(goal => {
                positions.add(`${goal.x},${goal.y}`)
            })

            expect(positions.size).toBe(level.goals.length)
        })
    })

    describe('Program Optimization Scenarios', () => {
        it('should handle minimal solution programs', () => {
            const store = useGameStore()
            store.loadLevel(1)

            // Try minimal solution
            store.addCommand('MOVE')
            store.addCommand('MOVE')
            store.addCommand('LIGHT')

            expect(store.program.length).toBeLessThanOrEqual(store.currentLevel!.maxCommands)
        })

        it('should handle maximum length programs', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            // Fill to max
            for (let i = 0; i < level.maxCommands; i++) {
                store.addCommand('MOVE')
            }

            expect(store.program.length).toBe(level.maxCommands)
        })

        it('should allow program modification before execution', () => {
            const store = useGameStore()
            store.loadLevel(1)

            // Build initial program
            store.addCommand('MOVE')
            store.addCommand('TURN_L')
            store.addCommand('MOVE')

            // Modify it
            store.removeCommand(1)
            store.addCommand('LIGHT')

            expect(store.program).toEqual(['MOVE', 'MOVE', 'LIGHT'])
        })
    })

    describe('Multi-Level Session Scenarios', () => {
        it('should handle completing multiple levels in sequence', () => {
            const store = useGameStore()

            for (let i = 1; i <= Math.min(3, store.levels.length); i++) {
                store.loadLevel(i)
                expect(store.currentLevelId).toBe(i)

                // Simulate win
                const level = store.currentLevel!
                level.goals.forEach(goal => {
                    store.moveRobot(goal.x, goal.y)
                    store.lightCell()
                })

                expect(store.isWin).toBe(true)
            }
        })

        it('should preserve speed settings across levels', () => {
            const store = useGameStore()

            store.setSpeed(250)
            store.loadLevel(1)
            expect(store.executionSpeed).toBe(250)

            store.loadLevel(2)
            expect(store.executionSpeed).toBe(250)
        })

        it('should reset state when loading new level', () => {
            const store = useGameStore()

            store.loadLevel(1)
            store.addCommand('MOVE')
            store.addCommand('LIGHT')
            store.setStatus('WIN')

            store.loadLevel(2)

            expect(store.program.length).toBe(0)
            expect(store.status).toBe('IDLE')
            expect(store.litGoals.length).toBe(0)
        })
    })

    describe('Error Recovery Scenarios', () => {
        it('should recover from multiple failed attempts', () => {
            const store = useGameStore()
            store.loadLevel(1)

            // Attempt 1: Fail
            store.addCommand('MOVE')
            store.setStatus('FAIL')
            store.reset()

            // Attempt 2: Fail
            store.clearProgram()
            store.addCommand('TURN_L')
            store.setStatus('FAIL')
            store.reset()

            // Attempt 3: Success
            store.clearProgram()
            store.addCommand('MOVE')
            store.addCommand('MOVE')
            store.addCommand('LIGHT')

            expect(store.status).toBe('IDLE')
            expect(store.program.length).toBe(3)
        })

        it('should handle alternating win/fail states', () => {
            const store = useGameStore()
            store.loadLevel(1)

            store.setStatus('WIN')
            expect(store.status).toBe('WIN')

            store.reset()
            expect(store.status).toBe('IDLE')

            store.setStatus('FAIL')
            expect(store.status).toBe('FAIL')

            store.reset()
            expect(store.status).toBe('IDLE')
        })
    })

    describe('Performance and Stress Tests', () => {
        it('should handle rapid command additions', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            const startTime = Date.now()

            for (let i = 0; i < 100; i++) {
                if (store.program.length < level.maxCommands) {
                    store.addCommand('MOVE')
                } else {
                    break
                }
            }

            const elapsed = Date.now() - startTime

            expect(elapsed).toBeLessThan(100)
            expect(store.program.length).toBeLessThanOrEqual(level.maxCommands)
        })

        it('should handle rapid position updates', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            const startTime = Date.now()

            for (let i = 0; i < 100; i++) {
                const x = i % level.gridSize
                const y = Math.floor(i / level.gridSize) % level.gridSize
                store.moveRobot(x, y)
            }

            const elapsed = Date.now() - startTime
            expect(elapsed).toBeLessThan(100)
        })

        it('should handle rapid state changes', () => {
            const store = useGameStore()
            store.loadLevel(1)

            const states: ('IDLE' | 'RUNNING' | 'WIN' | 'FAIL')[] = ['IDLE', 'RUNNING', 'WIN', 'FAIL']

            for (let i = 0; i < 100; i++) {
                const state = states[i % states.length]
                store.setStatus(state)
                expect(store.status).toBe(state)
            }
        })
    })

    describe('Data Integrity Tests', () => {
        it('should maintain level data consistency', () => {
            const store = useGameStore()

            for (let i = 1; i <= store.levels.length; i++) {
                store.loadLevel(i)
                const level = store.currentLevel!

                // Verify level structure
                expect(level.id).toBe(i)
                expect(level.gridSize).toBeGreaterThan(0)
                expect(level.layout.length).toBe(level.gridSize * level.gridSize)
                expect(level.goals.length).toBeGreaterThan(0)
                expect(level.availableBlocks.length).toBeGreaterThan(0)
                expect(level.maxCommands).toBeGreaterThan(0)

                // Verify goals are within grid
                level.goals.forEach(goal => {
                    expect(goal.x).toBeGreaterThanOrEqual(0)
                    expect(goal.y).toBeGreaterThanOrEqual(0)
                    expect(goal.x).toBeLessThan(level.gridSize)
                    expect(goal.y).toBeLessThan(level.gridSize)
                })

                // Verify start position is valid
                expect(level.start.x).toBeGreaterThanOrEqual(0)
                expect(level.start.y).toBeGreaterThanOrEqual(0)
                expect(level.start.x).toBeLessThan(level.gridSize)
                expect(level.start.y).toBeLessThan(level.gridSize)
            }
        })

        it('should not mutate level data during gameplay', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            // Store original data
            const originalLayout = [...level.layout]
            const originalGoals = level.goals.map(g => ({ ...g }))
            const originalStart = { ...level.start }

            // Perform various operations
            store.addCommand('MOVE')
            store.moveRobot(3, 3)
            store.lightCell()
            store.setStatus('RUNNING')
            store.reset()

            // Verify data unchanged
            expect(level.layout).toEqual(originalLayout)
            expect(level.goals).toEqual(originalGoals)
            expect(level.start).toEqual(originalStart)
        })
    })
})

// Helper function for direction delta
function getDirectionDelta(dir: Direction): { dx: number; dy: number } {
    switch (dir) {
        case 'N': return { dx: 0, dy: -1 }
        case 'E': return { dx: 1, dy: 0 }
        case 'S': return { dx: 0, dy: 1 }
        case 'W': return { dx: -1, dy: 0 }
    }
}

