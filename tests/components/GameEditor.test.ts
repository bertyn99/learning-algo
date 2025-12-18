import { describe, it, expect, beforeEach, vi } from 'vitest'
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
                VueDraggable: { template: '<div><slot></slot></div>' },
                UIcon: true,
                ProgramBlockComponent: true
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
            expect(wrapper.text()).toContain('Glisse des blocs ici pour commencer')
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

    describe('Add Command Functionality', () => {
        it('should add command when store action called', () => {
            const store = useGameStore()
            store.loadLevel(1)

            expect(store.program.length).toBe(0)
            store.addCommand('MOVE')
            expect(store.program.length).toBe(1)
            expect(store.program[0].command).toBe('MOVE')
        })
    })

    describe('Delete Command Functionality', () => {
        it('should remove command when delete called with id', () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.addCommand('MOVE')
            store.addCommand('LIGHT')

            const idToRemove = store.program[0].id
            expect(store.program.length).toBe(2)
            store.removeCommand(idToRemove)
            expect(store.program.length).toBe(1)
            expect(store.program[0].command).toBe('LIGHT')
        })
    })
})
