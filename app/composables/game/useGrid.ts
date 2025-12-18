import { useGameStore } from '~/stores/game'

export const useGrid = () => {
    const store = useGameStore()

    /**
     * Checks if a position is within the grid bounds and is a walkable tile (ground or goal)
     */
    const isValidPosition = (x: number, y: number): boolean => {
        const level = store.currentLevel
        if (!level) return false

        if (x < 0 || x >= level.gridSize || y < 0 || y >= level.gridSize) {
            return false
        }

        const index = y * level.gridSize + x
        const cellType = level.layout[index]
        // 0: empty, 1: ground, 2: goal
        return cellType === 1 || cellType === 2
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
        isValidPosition,
        isGoal
    }
}

