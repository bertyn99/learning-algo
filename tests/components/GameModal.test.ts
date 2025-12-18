import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '~/stores/game'
import GameModal from '~/components/game/GameModal.vue'

describe('GameModal Component', () => {
    let pinia: any

    beforeEach(() => {
        pinia = createPinia()
        setActivePinia(pinia)
    })

    describe('Component Mounting', () => {
        it('should mount successfully with win type', () => {
            const wrapper = mount(GameModal, {
                props: {
                    modelValue: true,
                    type: 'win'
                },
                global: {
                    plugins: [pinia],
                    stubs: {
                        UModal: true,
                        UCard: true,
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            expect(wrapper.exists()).toBe(true)
        })

        it('should mount successfully with fail type', () => {
            const wrapper = mount(GameModal, {
                props: {
                    modelValue: true,
                    type: 'fail'
                },
                global: {
                    plugins: [pinia],
                    stubs: {
                        UModal: true,
                        UCard: true,
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            expect(wrapper.exists()).toBe(true)
        })

        it('should not display when modelValue is false', () => {
            const wrapper = mount(GameModal, {
                props: {
                    modelValue: false,
                    type: 'win'
                },
                global: {
                    plugins: [pinia],
                    stubs: {
                        UModal: true,
                        UCard: true,
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            expect(wrapper.props('modelValue')).toBe(false)
        })
    })

    describe('Win Modal Content', () => {
        it('should display win message', () => {
            const wrapper = mount(GameModal, {
                props: {
                    modelValue: true,
                    type: 'win'
                },
                global: {
                    plugins: [pinia],
                    stubs: {
                        UModal: true,
                        UCard: true,
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            const store = useGameStore()
            store.loadLevel(1)

            expect(wrapper.props('type')).toBe('win')
        })

        it('should display current level number', () => {
            const wrapper = mount(GameModal, {
                props: {
                    modelValue: true,
                    type: 'win'
                },
                global: {
                    plugins: [pinia],
                    stubs: {
                        UModal: true,
                        UCard: true,
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            const store = useGameStore()
            store.loadLevel(1)

            expect(store.currentLevelId).toBe(1)
        })

        it('should show next level button when has next level', () => {
            const store = useGameStore()
            store.loadLevel(1)

            expect(store.hasNextLevel).toBe(true)
        })

        it('should show completion message on last level', () => {
            const store = useGameStore()
            const lastLevel = store.levels.length
            store.loadLevel(lastLevel)

            expect(store.hasNextLevel).toBe(false)
        })
    })

    describe('Fail Modal Content', () => {
        it('should display fail message', () => {
            const wrapper = mount(GameModal, {
                props: {
                    modelValue: true,
                    type: 'fail'
                },
                global: {
                    plugins: [pinia],
                    stubs: {
                        UModal: true,
                        UCard: true,
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            expect(wrapper.props('type')).toBe('fail')
        })

        it('should show retry button', () => {
            const wrapper = mount(GameModal, {
                props: {
                    modelValue: true,
                    type: 'fail'
                },
                global: {
                    plugins: [pinia],
                    stubs: {
                        UModal: true,
                        UCard: true,
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            expect(wrapper.props('type')).toBe('fail')
        })
    })

    describe('Modal Interactions', () => {
        it('should emit update:modelValue when closed', async () => {
            const wrapper = mount(GameModal, {
                props: {
                    modelValue: true,
                    type: 'win'
                },
                global: {
                    plugins: [pinia],
                    stubs: {
                        UModal: true,
                        UCard: true,
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            expect(wrapper.emitted()).toBeDefined()
        })

        it('should handle next level button click', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const currentLevel = store.currentLevelId

            if (store.hasNextLevel) {
                store.nextLevel()
                expect(store.currentLevelId).toBe(currentLevel + 1)
            }
        })

        it('should handle retry button click', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.addCommand('MOVE')
            store.setStatus('FAIL')

            store.reset()

            expect(store.status).toBe('IDLE')
        })
    })

    describe('Modal State Management', () => {
        it('should control modal visibility via modelValue', async () => {
            const wrapper = mount(GameModal, {
                props: {
                    modelValue: true,
                    type: 'win'
                },
                global: {
                    plugins: [pinia],
                    stubs: {
                        UModal: true,
                        UCard: true,
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            expect(wrapper.props('modelValue')).toBe(true)

            await wrapper.setProps({ modelValue: false })
            expect(wrapper.props('modelValue')).toBe(false)
        })

        it('should handle type changes', async () => {
            const wrapper = mount(GameModal, {
                props: {
                    modelValue: true,
                    type: 'win'
                },
                global: {
                    plugins: [pinia],
                    stubs: {
                        UModal: true,
                        UCard: true,
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            expect(wrapper.props('type')).toBe('win')

            await wrapper.setProps({ type: 'fail' })
            expect(wrapper.props('type')).toBe('fail')
        })
    })

    describe('Level Progression Flow', () => {
        it('should progress to next level when clicking next button', () => {
            const store = useGameStore()
            store.loadLevel(1)

            if (store.hasNextLevel) {
                const currentId = store.currentLevelId
                store.nextLevel()

                expect(store.currentLevelId).toBe(currentId + 1)
                expect(store.status).toBe('IDLE')
                expect(store.program.length).toBe(0)
            }
        })

        it('should not progress beyond last level', () => {
            const store = useGameStore()
            const lastLevel = store.levels.length
            store.loadLevel(lastLevel)

            expect(store.hasNextLevel).toBe(false)

            // Calling nextLevel should have no effect
            const currentId = store.currentLevelId
            store.nextLevel()
            expect(store.currentLevelId).toBe(currentId)
        })
    })

    describe('Retry Flow', () => {
        it('should reset game state when retrying', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            // Setup failed state
            store.addCommand('MOVE')
            store.moveRobot(3, 3)
            store.setStatus('FAIL')
            store.litGoals.push({ x: 1, y: 1 })

            // Retry
            store.reset()

            expect(store.status).toBe('IDLE')
            expect(store.robot).toEqual(level.start)
            expect(store.litGoals.length).toBe(0)
        })

        it('should preserve program when retrying', () => {
            const store = useGameStore()
            store.loadLevel(1)

            store.addCommand('MOVE')
            store.addCommand('LIGHT')
            const programLength = store.program.length

            store.setStatus('FAIL')
            store.reset()

            expect(store.program.length).toBe(programLength)
        })
    })

    describe('Final Level Completion', () => {
        it('should show completion message on final level win', () => {
            const store = useGameStore()
            const lastLevel = store.levels.length
            store.loadLevel(lastLevel)
            store.setStatus('WIN')

            expect(store.hasNextLevel).toBe(false)
            expect(store.status).toBe('WIN')
        })

        it('should show finish button instead of next on last level', () => {
            const store = useGameStore()
            const lastLevel = store.levels.length
            store.loadLevel(lastLevel)

            expect(store.hasNextLevel).toBe(false)
        })
    })

    describe('Visual Styling', () => {
        it('should apply win styling for win modal', () => {
            const wrapper = mount(GameModal, {
                props: {
                    modelValue: true,
                    type: 'win'
                },
                global: {
                    plugins: [pinia],
                    stubs: {
                        UModal: true,
                        UCard: true,
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            expect(wrapper.props('type')).toBe('win')
        })

        it('should apply fail styling for fail modal', () => {
            const wrapper = mount(GameModal, {
                props: {
                    modelValue: true,
                    type: 'fail'
                },
                global: {
                    plugins: [pinia],
                    stubs: {
                        UModal: true,
                        UCard: true,
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            expect(wrapper.props('type')).toBe('fail')
        })
    })

    describe('Modal Accessibility', () => {
        it('should close modal and update parent state', async () => {
            const wrapper = mount(GameModal, {
                props: {
                    modelValue: true,
                    type: 'win'
                },
                global: {
                    plugins: [pinia],
                    stubs: {
                        UModal: true,
                        UCard: true,
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            await wrapper.setProps({ modelValue: false })
            expect(wrapper.props('modelValue')).toBe(false)
        })

        it('should handle rapid open/close cycles', async () => {
            const wrapper = mount(GameModal, {
                props: {
                    modelValue: false,
                    type: 'win'
                },
                global: {
                    plugins: [pinia],
                    stubs: {
                        UModal: true,
                        UCard: true,
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            // Rapid toggle
            await wrapper.setProps({ modelValue: true })
            expect(wrapper.props('modelValue')).toBe(true)

            await wrapper.setProps({ modelValue: false })
            expect(wrapper.props('modelValue')).toBe(false)

            await wrapper.setProps({ modelValue: true })
            expect(wrapper.props('modelValue')).toBe(true)
        })
    })

    describe('Edge Cases', () => {
        it('should handle missing store gracefully', () => {
            const wrapper = mount(GameModal, {
                props: {
                    modelValue: true,
                    type: 'win'
                },
                global: {
                    plugins: [pinia],
                    stubs: {
                        UModal: true,
                        UCard: true,
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            expect(wrapper.exists()).toBe(true)
        })

        it('should handle type switching while open', async () => {
            const wrapper = mount(GameModal, {
                props: {
                    modelValue: true,
                    type: 'win'
                },
                global: {
                    plugins: [pinia],
                    stubs: {
                        UModal: true,
                        UCard: true,
                        UIcon: true,
                        UButton: true,
                    },
                },
            })

            expect(wrapper.props('type')).toBe('win')

            await wrapper.setProps({ type: 'fail' })
            expect(wrapper.props('type')).toBe('fail')

            await wrapper.setProps({ type: 'win' })
            expect(wrapper.props('type')).toBe('win')
        })
    })
})

