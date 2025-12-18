import { useGameStore } from '~/stores/game'

export const useGrid = () => {
    const store = useGameStore()

    const getTileAt = (x: number, y: number) => {
        const level = store.currentLevel
        if (!level) return null
        return level.layout.find(t => t.x === x && t.y === y)
    }

    /**
     * Checks if a position is within the grid bounds and is a walkable tile
     */
    const isValidPosition = (x: number, y: number): boolean => {
        const tile = getTileAt(x, y)
        if (!tile || tile.type === 'void') return false

        // Handle Doors
        if (tile.type === 'door' && tile.id) {
            const isOpen = store.interactiveState[tile.id]
            if (!isOpen) return false
        }

        // Handle Cracked Tiles
        if (tile.type === 'cracked' && tile.id) {
            const isSafe = store.interactiveState[tile.id]
            if (isSafe === false) return false
        }

        return true
    }

    /**
     * Checks if a position is a goal cell
     */
    const isGoal = (x: number, y: number): boolean => {
        const level = store.currentLevel
        if (!level) return false
        return level.goals.some(goal => goal.x === x && goal.y === y)
    }

    return {
        getTileAt,
        isValidPosition,
        isGoal
    }
}
