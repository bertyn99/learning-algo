import type { Direction } from '~/types/game'

export const useRobot = () => {
    const directions: Direction[] = ['N', 'E', 'S', 'W']

    /**
     * Calculates the position delta based on a direction
     */
    const getDirectionDelta = (dir: Direction): { dx: number; dy: number } => {
        switch (dir) {
            case 'N': return { dx: 0, dy: -1 }
            case 'E': return { dx: 1, dy: 0 }
            case 'S': return { dx: 0, dy: 1 }
            case 'W': return { dx: -1, dy: 0 }
        }
    }

    /**
     * Calculates the next direction when turning left
     */
    const getTurnLeftDirection = (currentDir: Direction): Direction => {
        const index = directions.indexOf(currentDir)
        if (index === -1) return 'N'
        return directions[(index + 3) % 4] || 'N'
    }

    /**
     * Calculates the next direction when turning right
     */
    const getTurnRightDirection = (currentDir: Direction): Direction => {
        const index = directions.indexOf(currentDir)
        if (index === -1) return 'N'
        return directions[(index + 1) % 4] || 'N'
    }

    return {
        getDirectionDelta,
        getTurnLeftDirection,
        getTurnRightDirection
    }
}

