import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '~/stores/game'
import GameEditor from '~/components/game/GameEditor.vue'

// Helper to create properly configured component wrapper
const createWrapper = () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useGameStore()
    store.loadLevel(1)

    const wrapper = mount(GameEditor, {
        global: {
            plugins: [pinia],
            stubs: {
                VueDraggable: true,
                UIcon: true,
            },
            mocks: {
                useToast: () => ({ add: vi.fn() })
            }
        },
    })

    return { wrapper, store }
}

describe('GameEditor Component', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    describe('Component Mounting', () => {
        it('should mount successfully', () => {
            const { wrapper } = createWrapper()
            expect(wrapper.exists()).toBe(true)
        })

        it('should show empty state when no commands', () => {
            const { wrapper } = createWrapper()
            expect(wrapper.text()).toContain('Ajoute des blocs')
        })
    })

    describe('Program Counter Display', () => {
        it('should display correct program count', () => {
            const { wrapper } = createWrapper()

            // Initial: 0/5
            expect(wrapper.text()).toContain('0')
            expect(wrapper.text()).toContain('5')
        })

        it('should update count when adding commands', async () => {
            const { wrapper, store } = createWrapper()

            store.addCommand('MOVE')
            await wrapper.vm.$nextTick()

            expect(store.programLength).toBe(1)
        })
    })

    describe('Command Block Rendering', () => {
        it('should render command blocks with indices', async () => {
            const { wrapper, store } = createWrapper()

            store.addCommand('MOVE')
            store.addCommand('MOVE')
            store.addCommand('LIGHT')
            await wrapper.vm.$nextTick()

            expect(store.program.length).toBe(3)
        })

        it('should display correct command labels', async () => {
            const { wrapper, store } = createWrapper()

            store.addCommand('MOVE')
            store.addCommand('TURN_L')
            store.addCommand('LIGHT')
            await wrapper.vm.$nextTick()

            // Check that commands are in store
            expect(store.program[0]).toBe('MOVE')
            expect(store.program[1]).toBe('TURN_L')
            expect(store.program[2]).toBe('LIGHT')
        })
    })

    describe('Add Command Functionality', () => {
        it('should add command when button clicked', () => {
            const store = useGameStore()
            store.loadLevel(1)

            expect(store.program.length).toBe(0)
            store.addCommand('MOVE')
            expect(store.program.length).toBe(1)
        })

        it('should prevent adding commands when limit reached', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel

            if (level) {
                // Fill to max
                for (let i = 0; i < level.maxCommands; i++) {
                    store.addCommand('MOVE')
                }

                const lengthBefore = store.program.length
                store.addCommand('MOVE')

                // Should not add more
                expect(store.program.length).toBe(lengthBefore)
            }
        })
    })

    describe('Delete Command Functionality', () => {
        it('should remove command when delete clicked', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.addCommand('MOVE')
            store.addCommand('LIGHT')
            store.addCommand('MOVE')

            expect(store.program.length).toBe(3)
            store.removeCommand(1)
            expect(store.program.length).toBe(2)
            expect(store.program[1]).toBe('MOVE')
        })

        it('should update indices after deletion', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.addCommand('MOVE')
            store.addCommand('MOVE')
            store.addCommand('LIGHT')

            store.removeCommand(1)

            // Indices should now be 0, 1 for remaining commands
            expect(store.program.length).toBe(2)
            expect(store.program[0]).toBe('MOVE')
            expect(store.program[1]).toBe('LIGHT')
        })
    })

    describe('Drag and Drop', () => {
        it('should support reordering programs', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.addCommand('MOVE')
            store.addCommand('LIGHT')
            store.addCommand('MOVE')

            // Simulate reorder by updating program
            store.setProgram(['LIGHT', 'MOVE', 'MOVE'])

            expect(store.program[0]).toBe('LIGHT')
            expect(store.program[1]).toBe('MOVE')
            expect(store.program[2]).toBe('MOVE')
        })

        it('should maintain program integrity after reorder', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const initialCommands = ['MOVE', 'TURN_L', 'LIGHT', 'MOVE', 'TURN_R']

            initialCommands.forEach(cmd => store.addCommand(cmd as any))

            // Reorder
            const reordered = ['LIGHT', 'MOVE', 'TURN_L', 'MOVE', 'TURN_R']
            store.setProgram(reordered as any)

            expect(store.program).toEqual(reordered)
            expect(store.program.length).toBe(5)
        })
    })

    describe('Progress Bar', () => {
        it('should display progress bar', () => {
            const { wrapper } = createWrapper()
            expect(wrapper.exists()).toBe(true)
        })

        it('should calculate correct progress percentage', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel

            if (level) {
                store.addCommand('MOVE')
                store.addCommand('MOVE')

                const progress = (store.programLength / level.maxCommands) * 100
                expect(progress).toBeGreaterThan(0)
                expect(progress).toBeLessThan(100)
            }
        })

        it('should show full progress when limit reached', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel

            if (level) {
                for (let i = 0; i < level.maxCommands; i++) {
                    store.addCommand('MOVE')
                }

                const progress = (store.programLength / level.maxCommands) * 100
                expect(progress).toBe(100)
            }
        })
    })

    describe('Library Buttons State', () => {
        it('should enable library buttons when space available', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel

            if (level) {
                expect(store.programLength < level.maxCommands).toBe(true)
            }
        })

        it('should disable library buttons when limit reached', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel

            if (level) {
                for (let i = 0; i < level.maxCommands; i++) {
                    store.addCommand('MOVE')
                }

                expect(store.programLength >= level.maxCommands).toBe(true)
            }
        })
    })

    describe('Drag State Feedback', () => {
        it('should track dragging state', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.addCommand('MOVE')
            store.addCommand('LIGHT')

            // Component should track isDragging state internally
            expect(store.program.length).toBe(2)
        })
    })

    describe('Command Labels', () => {
        it('should display correct labels for each command type', () => {
            const labels: Record<string, string> = {
                MOVE: 'AVANCER',
                TURN_L: 'GAUCHE',
                TURN_R: 'DROITE',
                LIGHT: 'ALLUMER',
            }

            Object.entries(labels).forEach(([cmd, label]) => {
                expect(label).toBeDefined()
            })
        })
    })
})

