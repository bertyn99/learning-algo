import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '../../app/stores/game'
import { useGameEngine } from '../../app/composables/useGameEngine'

// Mock useToast
vi.stubGlobal('useToast', () => ({
    add: vi.fn()
}))

// Mock ref
vi.stubGlobal('ref', (val: any) => ({ value: val }))

describe('Game Engine v2.0', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
        const store = useGameStore()
        store.setSpeed(0) // Fast tests
    })

    describe('Jump System', () => {
        it('should allow jump on flat ground (delta 0)', async () => {
            const store = useGameStore()
            store.loadLevel(1)
            store.robot = { x: 0, y: 0, dir: 'E' }

            const engine = useGameEngine()
            const success = await engine.executeCommand('JUMP')

            expect(success).toBe(true)
            expect(store.robot.x).toBe(1)
            expect(store.robot.y).toBe(0)
        })

        it('should allow climbing (delta 1)', async () => {
            const store = useGameStore()
            store.loadLevel(1)
            const targetTile = store.currentLevel?.layout.find(t => t.x === 1 && t.y === 0)
            if (targetTile) targetTile.height = 1

            store.robot = { x: 0, y: 0, dir: 'E' }

            const engine = useGameEngine()
            const success = await engine.executeCommand('JUMP')

            expect(success).toBe(true)
            expect(store.robot.x).toBe(1)
        })

        it('should allow dropping (delta -1)', async () => {
            const store = useGameStore()
            store.loadLevel(1)
            const currentTile = store.currentLevel?.layout.find(t => t.x === 0 && t.y === 0)
            if (currentTile) currentTile.height = 1

            store.robot = { x: 0, y: 0, dir: 'E' }

            const engine = useGameEngine()
            const success = await engine.executeCommand('JUMP')

            expect(success).toBe(true)
            expect(store.robot.x).toBe(1)
        })

        it('should fail if height delta > 1', async () => {
            const store = useGameStore()
            store.loadLevel(1)
            const targetTile = store.currentLevel?.layout.find(t => t.x === 1 && t.y === 0)
            if (targetTile) targetTile.height = 2

            store.robot = { x: 0, y: 0, dir: 'E' }

            const engine = useGameEngine()
            const success = await engine.executeCommand('JUMP')

            expect(success).toBe(false)
            expect(store.robot.x).toBe(0)
        })

        it('should fail standard MOVE if height delta !== 0', async () => {
            const store = useGameStore()
            store.loadLevel(1)
            const targetTile = store.currentLevel?.layout.find(t => t.x === 1 && t.y === 0)
            if (targetTile) targetTile.height = 1

            store.robot = { x: 0, y: 0, dir: 'E' }

            const engine = useGameEngine()
            const success = await engine.executeCommand('MOVE')

            expect(success).toBe(false)
            expect(store.robot.x).toBe(0)
        })
    })

    describe('Recursion & Control Flow', () => {
        it('should execute LOOP commands correctly', async () => {
            const store = useGameStore()
            store.loadLevel(1)
            // Ensure path is long enough for LOOP 3
            const tiles = store.currentLevel?.layout
            if (tiles) {
                tiles.forEach(t => { if (t.y === 0) t.type = 'ground' })
            }

            // LOOP 3 times MOVE
            store.program = [{
                id: '1',
                type: 'LOOP',
                iterations: 3,
                children: [{
                    id: '2',
                    type: 'COMMAND',
                    command: 'MOVE'
                }]
            }]

            const engine = useGameEngine()
            await engine.execute()

            expect(store.robot.x).toBe(3)
        })

        it('should execute IF_COLOR commands correctly', async () => {
            const store = useGameStore()
            store.loadLevel(1)
            const currentTile = store.currentLevel?.layout.find(t => t.x === 0 && t.y === 0)
            if (currentTile) currentTile.color = 'red'

            // IF red THEN MOVE
            store.program = [{
                id: '1',
                type: 'IF_COLOR',
                conditionColor: 'red',
                children: [{
                    id: '2',
                    type: 'COMMAND',
                    command: 'MOVE'
                }]
            }]

            const engine = useGameEngine()
            await engine.execute()

            expect(store.robot.x).toBe(1)
        })
    })
})
