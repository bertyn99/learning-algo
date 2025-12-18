import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '~/stores/game'
import ProgramBlock from '~/components/game/ProgramBlock.vue'

describe('ProgramBlock Recursive Component', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    const commandConfig = {
        MOVE: { label: 'MOVE', icon: 'i-ph-arrow-up', color: 'cyan', neon: '', bgGradient: '' },
        LIGHT: { label: 'LIGHT', icon: 'i-ph-lightbulb', color: 'cyan', neon: '', bgGradient: '' },
        TURN_L: { label: 'LEFT', icon: '', color: '', neon: '', bgGradient: '' },
        TURN_R: { label: 'RIGHT', icon: '', color: '', neon: '', bgGradient: '' },
        JUMP: { label: 'JUMP', icon: '', color: '', neon: '', bgGradient: '' },
        P1: { label: 'P1', icon: '', color: '', neon: '', bgGradient: '' },
    }

    it('should render a command block', () => {
        const block = { id: '1', type: 'COMMAND' as const, command: 'MOVE' as const }
        const wrapper = mount(ProgramBlock, {
            props: {
                block,
                index: 0,
                commandConfig
            },
            global: {
                stubs: { UIcon: true, VueDraggable: true }
            }
        })

        expect(wrapper.text()).toContain('MOVE')
    })

    it('should render a loop block with children', () => {
        const block = {
            id: 'loop1',
            type: 'LOOP' as const,
            iterations: 3,
            children: [
                { id: 'child1', type: 'COMMAND' as const, command: 'MOVE' as const }
            ]
        }

        // Use shallowMount to avoid infinite recursion if stubs aren't perfect, 
        // but here we want to test recursion so we mount.
        const wrapper = mount(ProgramBlock, {
            props: {
                block,
                index: 0,
                commandConfig
            },
            global: {
                stubs: { UIcon: true, VueDraggable: { template: '<div><slot></slot></div>' } }
            }
        })

        expect(wrapper.text()).toContain('REPEAT 3x')
        // Check if child is rendered (recursive call)
        expect(wrapper.text()).toContain('MOVE')
    })
})

