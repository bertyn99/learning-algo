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
        props: {
            level: store.currentLevel,
            robot: store.robot,
            litGoals: store.litGoals
        },
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
            // In v2, we check for tile-container
            expect(wrapper.find('.tile-container').exists()).toBe(true)
        })

        it('should not render when no level', () => {
            const pinia = createPinia()
            setActivePinia(pinia)
            const store = useGameStore()
            
            const wrapper = mount(GameViewport, {
                props: {
                    level: undefined,
                    robot: store.robot,
                    litGoals: store.litGoals
                },
                global: {
                    plugins: [pinia],
                    stubs: {
                        UIcon: true,
                    },
                },
            })

            expect(wrapper.find('.tile-container').exists()).toBe(false)
        })
    })

    describe('Grid Layout', () => {
        it('should render correct number of tiles', () => {
            const { wrapper, store } = createWrapper()
            const level = store.currentLevel!
            
            const tiles = wrapper.findAll('.tile-container')
            expect(tiles.length).toBe(level.layout.length)
        })
    })

    describe('Cell Types and Rendering', () => {
        it('should identify floor cells', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            const floorCells = level.layout.filter(tile => tile.type === 'ground')
            expect(floorCells.length).toBeGreaterThan(0)
        })

        it('should identify goal cells', () => {
            const store = useGameStore()
            store.loadLevel(1)
            const level = store.currentLevel!

            expect(level.goals.length).toBeGreaterThan(0)
        })
    })

    describe('Robot Position and Rendering', () => {
        it('should render robot container', () => {
            const { wrapper } = createWrapper()
            expect(wrapper.find('.robot-container').exists()).toBe(true)
        })

        it('should update robot position', async () => {
            const { wrapper, store } = createWrapper()
            
            const newX = 2
            const newY = 0
            store.moveRobot(newX, newY)
            
            await wrapper.setProps({ robot: { ...store.robot } })
            
            expect(store.robot.x).toBe(newX)
            expect(store.robot.y).toBe(newY)
        })
    })
})
