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

describe('Interaction Integration', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
        const store = useGameStore()
        store.setSpeed(0)
    })

    it('should toggle door state via switch', async () => {
        const store = useGameStore()
        store.loadLevel(1)

        // Setup: (1,0) is a switch targeting "door1". (2,0) is a door "door1".
        const switchTile = store.currentLevel?.layout.find(t => t.x === 1 && t.y === 0)
        if (switchTile) {
            switchTile.type = 'switch'
            switchTile.targetId = 'door1'
        }
        const doorTile = store.currentLevel?.layout.find(t => t.x === 2 && t.y === 0)
        if (doorTile) {
            doorTile.type = 'door'
            doorTile.id = 'door1'
            doorTile.state = false // Closed
        }
        store.initInteractiveState()

        const engine = useGameEngine()

        // 1. Try to move to (2,0) - should fail because door is closed
        store.robot = { x: 0, y: 0, dir: 'E' }
        await engine.executeCommand('MOVE') // Move to (1,0) - triggers switch
        expect(store.robot.x).toBe(1)
        expect(store.interactiveState['door1']).toBe(true) // Door should be open now

        // 2. Move to (2,0) - should succeed now
        await engine.executeCommand('MOVE')
        expect(store.robot.x).toBe(2)
    })

    it('should teleport robot correctly', async () => {
        const store = useGameStore()
        store.loadLevel(1)

        // Setup: (1,0) is a teleport targeting "tele2" at (3,3)
        const tele1 = store.currentLevel?.layout.find(t => t.x === 1 && t.y === 0)
        if (tele1) {
            tele1.type = 'teleport'
            tele1.targetId = 'tele2'
        }
        const tele2 = store.currentLevel?.layout.find(t => t.x === 3 && t.y === 3)
        if (tele2) {
            tele2.type = 'teleport'
            tele2.id = 'tele2'
            tele2.type = 'ground' // Target can be ground or teleport
        }

        const engine = useGameEngine()
        store.robot = { x: 0, y: 0, dir: 'E' }

        await engine.executeCommand('MOVE') // Move to (1,0)
        expect(store.robot.x).toBe(3)
        expect(store.robot.y).toBe(3)
    })

    it('should break cracked tile on leave', async () => {
        const store = useGameStore()
        store.loadLevel(1)

        // Setup: (1,0) is cracked
        const cracked = store.currentLevel?.layout.find(t => t.x === 1 && t.y === 0)
        if (cracked) {
            cracked.type = 'cracked'
            cracked.id = 'crack1'
            cracked.state = true // Safe
        }
        store.initInteractiveState()

        const engine = useGameEngine()
        store.robot = { x: 0, y: 0, dir: 'E' }

        await engine.executeCommand('MOVE') // Enter cracked
        expect(store.robot.x).toBe(1)
        expect(store.interactiveState['crack1']).toBe(true)

        await engine.executeCommand('MOVE') // Leave cracked
        expect(store.robot.x).toBe(2)
        expect(store.interactiveState['crack1']).toBe(false) // Now broken

        // Try to move back to (1,0) - should fail
        store.turnRobot('W')
        const success = await engine.executeCommand('MOVE')
        expect(success).toBe(false)
        expect(store.robot.x).toBe(2)
    })

    it('should reset interactive states on level reset', async () => {
        const store = useGameStore()
        store.loadLevel(1)

        const doorTile = store.currentLevel?.layout.find(t => t.x === 1 && t.y === 0)
        if (doorTile) {
            doorTile.type = 'door'
            doorTile.id = 'door1'
            doorTile.state = false // Initially closed
        }
        store.initInteractiveState()

        store.setInteractiveState('door1', true) // Manually open it
        expect(store.interactiveState['door1']).toBe(true)

        store.reset()
        expect(store.interactiveState['door1']).toBe(false) // Should be closed again
    })
})

