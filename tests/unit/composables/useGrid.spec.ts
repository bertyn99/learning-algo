import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '../../../app/stores/game'
import { useGrid } from '../../../app/composables/game/useGrid'

describe('useGrid', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('should retrieve tiles correctly', () => {
        const store = useGameStore()
        store.loadLevel(1)
        const grid = useGrid()

        const tile = grid.getTileAt(0, 0)
        expect(tile).toBeDefined()
        expect(tile?.x).toBe(0)
        expect(tile?.y).toBe(0)
    })

    it('should validate walkable positions', () => {
        const store = useGameStore()
        store.loadLevel(1)
        const grid = useGrid()

        // Ground is valid
        expect(grid.isValidPosition(0, 0)).toBe(true)

        // Void is invalid
        const voidTile = store.currentLevel?.layout.find(t => t.x === 1 && t.y === 1)
        if (voidTile) voidTile.type = 'void'
        expect(grid.isValidPosition(1, 1)).toBe(false)

        // Out of bounds is invalid
        expect(grid.isValidPosition(-1, 0)).toBe(false)
    })

    it('should handle door logic', () => {
        const store = useGameStore()
        store.loadLevel(1)
        const grid = useGrid()

        const doorTile = store.currentLevel?.layout.find(t => t.x === 1 && t.y === 0)
        if (doorTile) {
            doorTile.type = 'door'
            doorTile.id = 'door1'
        }

        store.initInteractiveState()

        // Door is closed by default
        expect(grid.isValidPosition(1, 0)).toBe(false)

        // Open the door
        store.setInteractiveState('door1', true)
        expect(grid.isValidPosition(1, 0)).toBe(true)
    })
})

