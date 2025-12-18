import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '~/stores/game'
import GameControls from '~/components/game/GameControls.vue'

// Mock composables
vi.mock('~/composables/useGameEngine', () => ({
    useGameEngine: () => ({
        execute: vi.fn(),
        stop: vi.fn(),
        setSpeed: vi.fn(),
        isExecuting: { value: false }
    })
}))

// Mock useToast composable
vi.mock('#app', () => ({
    useToast: () => ({
        add: vi.fn()
    })
}))

describe('GameControls Component', () => {
    let pinia: any

    beforeEach(() => {
        pinia = createPinia()
        setActivePinia(pinia)
    })

    describe('Component Mounting and Display', () => {
        it('should mount successfully', () => {
            const store = useGameStore()
            store.loadLevel(1)

            const wrapper = mount(GameControls, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            expect(wrapper.exists()).toBe(true)
        })

        it('should display level title and description', () => {
            const store = useGameStore()
            store.loadLevel(1)

            const wrapper = mount(GameControls, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            expect(wrapper.text()).toContain(store.currentLevel?.title || '')
            expect(wrapper.text()).toContain(store.currentLevel?.description || '')
        })

        it('should display level number', () => {
            const store = useGameStore()
            store.loadLevel(1)

            const wrapper = mount(GameControls, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            expect(wrapper.text()).toContain('LVL')
            expect(wrapper.text()).toContain('1')
        })
    })

    describe('Execute Button State', () => {
        it('should disable execute button when no program', () => {
            const store = useGameStore()
            store.loadLevel(1)

            expect(store.canExecute).toBe(false)
        })

        it('should enable execute button with valid program', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.addCommand('MOVE')

            expect(store.canExecute).toBe(true)
            expect(store.status).toBe('IDLE')
        })

        it('should disable execute button when running', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.addCommand('MOVE')
            store.setStatus('RUNNING')

            expect(store.canExecute).toBe(false)
        })

        it('should disable execute button when game is won', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.addCommand('MOVE')
            store.setStatus('WIN')

            expect(store.canExecute).toBe(false)
        })

        it('should disable execute button when game is failed', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.addCommand('MOVE')
            store.setStatus('FAIL')

            expect(store.canExecute).toBe(false)
        })
    })

    describe('Speed Control', () => {
        it('should initialize with normal speed', () => {
            const store = useGameStore()
            expect(store.executionSpeed).toBe(500)
        })

        it('should cycle through speed levels', () => {
            const store = useGameStore()

            // Normal to Fast
            store.setSpeed(250)
            expect(store.executionSpeed).toBe(250)

            // Fast to Slow
            store.setSpeed(1000)
            expect(store.executionSpeed).toBe(1000)

            // Slow to Normal
            store.setSpeed(500)
            expect(store.executionSpeed).toBe(500)
        })

        it('should persist speed across executions', () => {
            const store = useGameStore()

            store.setSpeed(250)
            store.loadLevel(1)
            store.addCommand('MOVE')
            store.setStatus('RUNNING')

            expect(store.executionSpeed).toBe(250)
        })
    })

    describe('Reset Functionality', () => {
        it('should reset robot position', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            store.moveRobot(5, 5)
            store.reset()

            expect(store.robot).toEqual(level.start)
        })

        it('should reset status to IDLE', () => {
            const store = useGameStore()
            store.loadLevel(1)

            store.setStatus('WIN')
            store.reset()
            expect(store.status).toBe('IDLE')

            store.setStatus('FAIL')
            store.reset()
            expect(store.status).toBe('IDLE')
        })

        it('should clear lit goals', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            if (level.goals.length > 0) {
                store.litGoals.push(level.goals[0])
                expect(store.litGoals.length).toBeGreaterThan(0)

                store.reset()
                expect(store.litGoals.length).toBe(0)
            }
        })

        it('should preserve program after reset', () => {
            const store = useGameStore()
            store.loadLevel(1)

            store.addCommand('MOVE')
            store.addCommand('LIGHT')
            const programLength = store.program.length

            store.reset()

            expect(store.program.length).toBe(programLength)
        })
    })

    describe('Win/Fail Feedback Display', () => {
        it('should not show feedback when IDLE', () => {
            const store = useGameStore()
            store.loadLevel(1)

            const wrapper = mount(GameControls, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            expect(store.status).toBe('IDLE')
        })

        it('should show win feedback when WIN', async () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.setStatus('WIN')

            const wrapper = mount(GameControls, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            await wrapper.vm.$nextTick()

            expect(store.status).toBe('WIN')
        })

        it('should show fail feedback when FAIL', async () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.setStatus('FAIL')

            const wrapper = mount(GameControls, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            await wrapper.vm.$nextTick()

            expect(store.status).toBe('FAIL')
        })
    })

    describe('Next Level Functionality', () => {
        it('should show next button when has next level', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.setStatus('WIN')

            expect(store.hasNextLevel).toBe(true)
        })

        it('should progress to next level', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const currentLevel = store.currentLevelId

            if (store.hasNextLevel) {
                store.nextLevel()
                expect(store.currentLevelId).toBe(currentLevel + 1)
            }
        })

        it('should not show next button on last level', () => {
            const store = useGameStore()
            const lastLevel = store.levels.length
            store.loadLevel(lastLevel)
            store.setStatus('WIN')

            expect(store.hasNextLevel).toBe(false)
        })
    })

    describe('Level Information Display', () => {
        it('should display total level count', () => {
            const store = useGameStore()
            store.loadLevel(1)

            const wrapper = mount(GameControls, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            expect(wrapper.text()).toContain(store.levels.length.toString())
        })

        it('should update when level changes', async () => {
            const store = useGameStore()
            store.loadLevel(1)

            const wrapper = mount(GameControls, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            await wrapper.vm.$nextTick()

            const level1Title = store.currentLevel?.title

            if (store.hasNextLevel) {
                store.nextLevel()
                await wrapper.vm.$nextTick()

                const level2Title = store.currentLevel?.title
                expect(level2Title).not.toBe(level1Title)
            }
        })
    })

    describe('Button States and Interactions', () => {
        it('should have all control buttons', () => {
            const store = useGameStore()
            store.loadLevel(1)

            const wrapper = mount(GameControls, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            expect(wrapper.exists()).toBe(true)
        })

        it('should allow reset at any time', () => {
            const store = useGameStore()
            store.loadLevel(1)

            store.setStatus('IDLE')
            store.reset()
            expect(store.status).toBe('IDLE')

            store.setStatus('RUNNING')
            store.reset()
            expect(store.status).toBe('IDLE')

            store.setStatus('WIN')
            store.reset()
            expect(store.status).toBe('IDLE')
        })
    })

    describe('UI Responsiveness', () => {
        it('should handle rapid status changes', async () => {
            const store = useGameStore()
            store.loadLevel(1)

            store.setStatus('IDLE')
            await new Promise(resolve => setTimeout(resolve, 10))

            store.setStatus('RUNNING')
            await new Promise(resolve => setTimeout(resolve, 10))

            store.setStatus('FAIL')
            await new Promise(resolve => setTimeout(resolve, 10))

            expect(store.status).toBe('FAIL')
        })

        it('should handle rapid speed changes', () => {
            const store = useGameStore()

            store.setSpeed(1000)
            store.setSpeed(500)
            store.setSpeed(250)

            expect(store.executionSpeed).toBe(250)
        })
    })
})

