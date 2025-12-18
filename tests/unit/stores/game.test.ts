import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '~/stores/game'
import type { Command } from '~/types/game'

describe('Game Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    describe('State Management', () => {
        it('should initialize with default state', () => {
            const store = useGameStore()
            expect(store.currentLevelId).toBe(1)
            expect(store.program).toEqual([])
            expect(store.status).toBe('IDLE')
            expect(store.litGoals).toEqual([])
        })

        it('should have correct initial robot position', () => {
            const store = useGameStore()
            const level = store.currentLevel
            if (level) {
                expect(store.robot).toEqual(level.start)
            }
        })
    })

    describe('Program Management', () => {
        it('should add a command', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.addCommand('MOVE')

            expect(store.program.length).toBe(1)
            expect(store.program[0]).toBe('MOVE')
        })

        it('should not add command if limit reached', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel

            if (level) {
                // Add max commands
                for (let i = 0; i < level.maxCommands; i++) {
                    store.addCommand('MOVE')
                }

                const initialLength = store.program.length
                store.addCommand('MOVE')

                expect(store.program.length).toBe(initialLength)
            }
        })

        it('should remove a command by index', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.addCommand('MOVE')
            store.addCommand('TURN_L')
            store.addCommand('LIGHT')

            expect(store.program.length).toBe(3)
            store.removeCommand(1)
            expect(store.program.length).toBe(2)
            expect(store.program[1]).toBe('LIGHT')
        })

        it('should set program', () => {
            const store = useGameStore()
            const newProgram: Command[] = ['MOVE', 'TURN_L', 'LIGHT']
            store.setProgram(newProgram)

            expect(store.program).toEqual(newProgram)
        })

        it('should clear program', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.addCommand('MOVE')
            store.addCommand('LIGHT')

            expect(store.program.length).toBeGreaterThan(0)
            store.clearProgram()
            expect(store.program).toEqual([])
        })
    })

    describe('Robot Movement', () => {
        it('should move robot to new position', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.moveRobot(2, 3)

            expect(store.robot.x).toBe(2)
            expect(store.robot.y).toBe(3)
        })

        it('should turn robot to different direction', () => {
            const store = useGameStore()
            store.loadLevel(1)

            store.turnRobot('E')
            expect(store.robot.dir).toBe('E')

            store.turnRobot('S')
            expect(store.robot.dir).toBe('S')

            store.turnRobot('W')
            expect(store.robot.dir).toBe('W')

            store.turnRobot('N')
            expect(store.robot.dir).toBe('N')
        })
    })

    describe('Goal Lighting', () => {
        it('should light a goal cell', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel

            if (level && level.goals.length > 0) {
                const goal = level.goals[0]
                store.moveRobot(goal.x, goal.y)
                store.lightCell()

                expect(store.litGoals.length).toBeGreaterThan(0)
                expect(store.litGoals[0]).toEqual(goal)
            }
        })

        it('should not light non-goal cells', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.moveRobot(0, 0)
            store.lightCell()

            // Should not add to litGoals if not a goal
            expect(store.litGoals.length).toBe(0)
        })

        it('should not duplicate lit goals', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel

            if (level && level.goals.length > 0) {
                const goal = level.goals[0]
                store.moveRobot(goal.x, goal.y)

                store.lightCell()
                store.lightCell()
                store.lightCell()

                expect(store.litGoals.length).toBe(1)
            }
        })
    })

    describe('Level Management', () => {
        it('should load a level', () => {
            const store = useGameStore()
            store.loadLevel(1)

            expect(store.currentLevelId).toBe(1)
            expect(store.currentLevel).toBeDefined()
            expect(store.program).toEqual([])
            expect(store.status).toBe('IDLE')
        })

        it('should progress to next level', () => {
            const store = useGameStore()
            const initialLevel = store.currentLevelId

            if (store.hasNextLevel) {
                store.nextLevel()
                expect(store.currentLevelId).toBe(initialLevel + 1)
            }
        })

        it('should reset position without changing status', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel

            if (level) {
                store.moveRobot(5, 5)
                store.setStatus('RUNNING')
                store.resetPosition()

                expect(store.robot).toEqual(level.start)
                expect(store.status).toBe('RUNNING')
            }
        })

        it('should reset completely', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel

            store.moveRobot(5, 5)
            store.addCommand('MOVE')
            store.setStatus('RUNNING')
            store.litGoals = [{ x: 2, y: 0 }]

            store.reset()

            expect(store.robot).toEqual(level!.start)
            expect(store.program.length).toBe(1) // Program not cleared by reset
            expect(store.status).toBe('IDLE')
            expect(store.litGoals).toEqual([])
        })
    })

    describe('Game Status', () => {
        it('should change game status', () => {
            const store = useGameStore()

            expect(store.status).toBe('IDLE')
            store.setStatus('RUNNING')
            expect(store.status).toBe('RUNNING')
            store.setStatus('WIN')
            expect(store.status).toBe('WIN')
            store.setStatus('FAIL')
            expect(store.status).toBe('FAIL')
        })

        it('should track current command index', () => {
            const store = useGameStore()

            expect(store.currentCommandIndex).toBe(-1)
            store.setCurrentCommandIndex(0)
            expect(store.currentCommandIndex).toBe(0)
            store.setCurrentCommandIndex(2)
            expect(store.currentCommandIndex).toBe(2)
        })
    })

    describe('Getters', () => {
        it('should calculate is win condition', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel

            if (level) {
                // Light all goals
                level.goals.forEach(goal => {
                    store.litGoals.push(goal)
                })

                expect(store.isWin).toBe(true)
            }
        })

        it('should determine can execute', () => {
            const store = useGameStore()
            store.loadLevel(1)

            // Can't execute without program
            expect(store.canExecute).toBe(false)

            store.addCommand('MOVE')
            expect(store.canExecute).toBe(true)

            store.setStatus('RUNNING')
            expect(store.canExecute).toBe(false)
        })

        it('should check for next level', () => {
            const store = useGameStore()
            store.loadLevel(1)

            expect(store.hasNextLevel).toBe(store.currentLevelId < store.levels.length)
        })

        it('should get program length', () => {
            const store = useGameStore()
            store.loadLevel(1)

            expect(store.programLength).toBe(0)

            store.addCommand('MOVE')
            store.addCommand('LIGHT')

            expect(store.programLength).toBe(2)
        })
    })

    describe('Speed Management', () => {
        it('should set execution speed', () => {
            const store = useGameStore()

            expect(store.executionSpeed).toBe(500)
            store.setSpeed(300)
            expect(store.executionSpeed).toBe(300)
            store.setSpeed(1000)
            expect(store.executionSpeed).toBe(1000)
        })
    })
})

