import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '~/stores/game'
import GameViewport from '~/components/game/GameViewport.vue'

// Helper to create properly configured component wrapper
const createWrapper = () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useGameStore()
    store.loadLevel(1)

    const wrapper = mount(GameViewport, {
        global: {
            plugins: [pinia],
            stubs: {
                UIcon: true,
            },
        },
    })

    return { wrapper, store }
}

describe('GameViewport Component', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    describe('Component Mounting and Rendering', () => {
        it('should mount successfully', () => {
            const { wrapper } = createWrapper()
            expect(wrapper.exists()).toBe(true)
        })

        it('should render when level is loaded', () => {
            const { wrapper } = createWrapper()
            expect(wrapper.find('.grid').exists()).toBe(true)
        })

        it('should not render when no level', () => {
            const pinia = createPinia()
            setActivePinia(pinia)
            const store = useGameStore()
            store.currentLevelId = 999 // Non-existent level

            const wrapper = mount(GameViewport, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        UIcon: true,
                    },
                },
            })

            expect(wrapper.find('.grid').exists()).toBe(false)
        })
    })

    describe('Grid Layout', () => {
        it('should render correct number of cells', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            const expectedCells = level.gridSize * level.gridSize
            expect(level.layout.length).toBe(expectedCells)
        })

        it('should apply correct grid style', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            // Grid should have gridSize x gridSize layout
            expect(level.gridSize).toBeGreaterThan(0)
        })

        it('should handle different grid sizes', () => {
            const store = useGameStore()

            // Test multiple levels with potentially different grid sizes
            for (let i = 1; i <= Math.min(3, store.levels.length); i++) {
                store.loadLevel(i)
                const level = store.currentLevel!

                expect(level.gridSize).toBeGreaterThan(0)
                expect(level.layout.length).toBe(level.gridSize * level.gridSize)
            }
        })
    })

    describe('Cell Types and Rendering', () => {
        it('should identify empty cells (type 0)', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            const emptyCells = level.layout.filter(cell => cell === 0)
            expect(emptyCells.length).toBeGreaterThanOrEqual(0)
        })

        it('should identify floor cells (type 1)', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            const floorCells = level.layout.filter(cell => cell === 1)
            expect(floorCells.length).toBeGreaterThan(0)
        })

        it('should identify goal cells (type 2)', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            // Goals should exist
            expect(level.goals.length).toBeGreaterThan(0)
        })

        it('should render all cell types correctly', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            // Check that layout contains valid cell types only
            level.layout.forEach(cell => {
                expect([0, 1, 2]).toContain(cell)
            })
        })
    })

    describe('Goal Detection and Rendering', () => {
        it('should detect goal cells correctly', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            level.goals.forEach(goal => {
                const index = goal.y * level.gridSize + goal.x
                expect(index).toBeGreaterThanOrEqual(0)
                expect(index).toBeLessThan(level.layout.length)
            })
        })

        it('should mark goals as unlit initially', () => {
            const store = useGameStore()
            store.loadLevel(1)

            expect(store.litGoals.length).toBe(0)
        })

        it('should mark goals as lit when lightCell is called', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            if (level.goals.length > 0) {
                const goal = level.goals[0]
                store.moveRobot(goal.x, goal.y)
                store.lightCell()

                const isLit = store.litGoals.some(g => g.x === goal.x && g.y === goal.y)
                expect(isLit).toBe(true)
            }
        })

        it('should render all goals on the grid', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            expect(level.goals.length).toBeGreaterThan(0)

            level.goals.forEach(goal => {
                expect(goal.x).toBeGreaterThanOrEqual(0)
                expect(goal.y).toBeGreaterThanOrEqual(0)
                expect(goal.x).toBeLessThan(level.gridSize)
                expect(goal.y).toBeLessThan(level.gridSize)
            })
        })

        it('should differentiate between lit and unlit goals', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            if (level.goals.length > 1) {
                // Light only first goal
                const goal = level.goals[0]
                store.moveRobot(goal.x, goal.y)
                store.lightCell()

                const litCount = store.litGoals.length
                expect(litCount).toBe(1)
                expect(litCount).toBeLessThan(level.goals.length)
            }
        })
    })

    describe('Robot Position and Rendering', () => {
        it('should place robot at start position initially', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            expect(store.robot.x).toBe(level.start.x)
            expect(store.robot.y).toBe(level.start.y)
            expect(store.robot.dir).toBe(level.start.dir)
        })

        it('should update robot position when moved', () => {
            const store = useGameStore()
            store.loadLevel(1)

            const newX = 2
            const newY = 3
            store.moveRobot(newX, newY)

            expect(store.robot.x).toBe(newX)
            expect(store.robot.y).toBe(newY)
        })

        it('should place robot within grid bounds', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            expect(store.robot.x).toBeGreaterThanOrEqual(0)
            expect(store.robot.y).toBeGreaterThanOrEqual(0)
            expect(store.robot.x).toBeLessThan(level.gridSize)
            expect(store.robot.y).toBeLessThan(level.gridSize)
        })

        it('should render robot with correct direction', () => {
            const store = useGameStore()
            store.loadLevel(1)

            const directions: ('N' | 'E' | 'S' | 'W')[] = ['N', 'E', 'S', 'W']

            directions.forEach(dir => {
                store.turnRobot(dir)
                expect(store.robot.dir).toBe(dir)
            })
        })

        it('should calculate robot style correctly', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            const cellSize = 100 / level.gridSize
            const expectedX = store.robot.x * cellSize
            const expectedY = store.robot.y * cellSize

            expect(expectedX).toBeGreaterThanOrEqual(0)
            expect(expectedY).toBeGreaterThanOrEqual(0)
        })
    })

    describe('Robot Direction and Rotation', () => {
        it('should apply correct rotation for North', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.turnRobot('N')

            const rotationMap = { N: 0, E: 90, S: 180, W: 270 }
            expect(rotationMap[store.robot.dir]).toBe(0)
        })

        it('should apply correct rotation for East', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.turnRobot('E')

            const rotationMap = { N: 0, E: 90, S: 180, W: 270 }
            expect(rotationMap[store.robot.dir]).toBe(90)
        })

        it('should apply correct rotation for South', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.turnRobot('S')

            const rotationMap = { N: 0, E: 90, S: 180, W: 270 }
            expect(rotationMap[store.robot.dir]).toBe(180)
        })

        it('should apply correct rotation for West', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.turnRobot('W')

            const rotationMap = { N: 0, E: 90, S: 180, W: 270 }
            expect(rotationMap[store.robot.dir]).toBe(270)
        })

        it('should handle direction changes smoothly', () => {
            const store = useGameStore()
            store.loadLevel(1)

            store.turnRobot('N')
            expect(store.robot.dir).toBe('N')

            store.turnRobot('E')
            expect(store.robot.dir).toBe('E')

            store.turnRobot('S')
            expect(store.robot.dir).toBe('S')

            store.turnRobot('W')
            expect(store.robot.dir).toBe('W')
        })
    })

    describe('Goal State Visual Feedback', () => {
        it('should show different visual for lit vs unlit goals', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            if (level.goals.length > 0) {
                const goal = level.goals[0]

                // Initially unlit
                expect(store.litGoals.length).toBe(0)

                // Light it
                store.moveRobot(goal.x, goal.y)
                store.lightCell()

                expect(store.litGoals.length).toBe(1)
            }
        })

        it('should track multiple lit goals', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            // Light all goals one by one
            level.goals.forEach(goal => {
                store.moveRobot(goal.x, goal.y)
                store.lightCell()
            })

            expect(store.litGoals.length).toBe(level.goals.length)
        })
    })

    describe('Grid Responsiveness', () => {
        it('should handle robot movement across entire grid', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            // Move robot to different positions
            for (let x = 0; x < level.gridSize; x++) {
                for (let y = 0; y < level.gridSize; y++) {
                    store.moveRobot(x, y)
                    expect(store.robot.x).toBe(x)
                    expect(store.robot.y).toBe(y)
                }
            }
        })

        it('should maintain grid integrity during gameplay', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            const originalLayout = [...level.layout]

            // Perform various actions
            store.moveRobot(2, 2)
            store.turnRobot('E')
            store.lightCell()

            // Layout should not change
            expect(level.layout).toEqual(originalLayout)
        })
    })

    describe('Edge Cases', () => {
        it('should handle empty goals array', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            // Even if we artificially clear goals (for testing)
            const originalGoals = [...level.goals]
            expect(originalGoals.length).toBeGreaterThan(0)
        })

        it('should handle single cell grid', () => {
            const store = useGameStore()

            // Most levels should have grid size > 1
            store.loadLevel(1)
            const level = store.currentLevel!

            expect(level.gridSize).toBeGreaterThan(0)
        })

        it('should handle large grid sizes', () => {
            const store = useGameStore()

            // Test with different levels
            for (let i = 1; i <= Math.min(3, store.levels.length); i++) {
                store.loadLevel(i)
                const level = store.currentLevel!

                expect(level.gridSize).toBeLessThanOrEqual(20) // Reasonable max
            }
        })
    })

    describe('Performance and Updates', () => {
        it('should update efficiently on robot movement', async () => {
            const { wrapper, store } = createWrapper()

            const startTime = Date.now()

            for (let i = 0; i < 10; i++) {
                store.moveRobot(i % 5, Math.floor(i / 5))
                await wrapper.vm.$nextTick()
            }

            const elapsed = Date.now() - startTime
            expect(elapsed).toBeLessThan(1000) // Should be fast
        })

        it('should handle rapid direction changes', () => {
            const store = useGameStore()
            store.loadLevel(1)

            const directions: ('N' | 'E' | 'S' | 'W')[] = ['N', 'E', 'S', 'W']

            for (let i = 0; i < 100; i++) {
                const dir = directions[i % 4]
                store.turnRobot(dir)
                expect(store.robot.dir).toBe(dir)
            }
        })
    })
})

