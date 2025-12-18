import { useGameStore } from '~/stores/game'
import { useExecution } from './game/useExecution'
import { useLevelManager } from './game/useLevelManager'

/**
 * Main Game Engine composable that orchestrates specialized logic units.
 * Acts as a facade for execution, grid, robot, and level management.
 */
export const useGameEngine = () => {
    const store = useGameStore()
    const execution = useExecution()
    const levelManager = useLevelManager()

    // Change la vitesse
    const setSpeed = (speed: number) => {
        store.setSpeed(speed)
    }

    return {
        // Execution control
        execute: execution.execute,
        stop: execution.stop,
        isExecuting: execution.isExecuting,
        executeCommand: execution.executeCommand,

        // Level management
        ...levelManager,

        // Configuration
        setSpeed
    }
}
