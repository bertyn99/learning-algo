import { ref } from 'vue'
import { useGameStore } from '~/stores/game'
import type { Command } from '~/types/game'
import { useGrid } from './useGrid'
import { useRobot } from './useRobot'

export const useExecution = () => {
    const store = useGameStore()
    const toast = useToast()
    const grid = useGrid()
    const robot = useRobot()

    const isExecuting = ref(false)
    let shouldStop = false

    /**
     * Helper to wait for a specific duration
     */
    const wait = (ms: number): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    /**
     * Executes a single command
     */
    const executeCommand = async (command: Command): Promise<boolean> => {
        console.log(`⚡ Executing command: ${command}`)

        switch (command) {
            case 'MOVE': {
                const delta = robot.getDirectionDelta(store.robot.dir)
                const newX = store.robot.x + delta.dx
                const newY = store.robot.y + delta.dy

                console.log(`🚶 Moving from (${store.robot.x}, ${store.robot.y}) to (${newX}, ${newY})`)

                if (grid.isValidPosition(newX, newY)) {
                    store.moveRobot(newX, newY)
                    console.log(`✅ Move successful! New position: (${newX}, ${newY})`)
                    return true
                } else {
                    console.log(`❌ Move failed! Invalid position: (${newX}, ${newY})`)
                    toast.add({
                        title: 'Oups !',
                        description: 'Le robot ne peut pas aller par là...',
                        color: 'error',
                        icon: 'i-ph-warning'
                    })
                    return false
                }
            }

            case 'TURN_L': {
                const newDir = robot.getTurnLeftDirection(store.robot.dir)
                console.log(`↶ Turning left from ${store.robot.dir} to ${newDir}`)
                store.turnRobot(newDir)
                return true
            }

            case 'TURN_R': {
                const newDir = robot.getTurnRightDirection(store.robot.dir)
                console.log(`↷ Turning right from ${store.robot.dir} to ${newDir}`)
                store.turnRobot(newDir)
                return true
            }

            case 'LIGHT': {
                console.log(`💡 Lighting cell at (${store.robot.x}, ${store.robot.y})`)
                store.lightCell()
                console.log(`🎯 Lit goals:`, store.litGoals)
                return true
            }

            default:
                return true
        }
    }

    /**
     * Runs the program sequence
     */
    const execute = async () => {
        console.log('🚀 Starting program execution')
        if (isExecuting.value) return

        if (store.program.length === 0) {
            toast.add({
                title: 'Programme vide',
                description: 'Ajoute des blocs avant de lancer le programme !',
                color: 'warning',
                icon: 'i-ph-warning-circle'
            })
            return
        }

        isExecuting.value = true
        shouldStop = false
        store.setStatus('RUNNING')

        // Reset temporary state for execution
        const level = store.currentLevel
        if (level) {
            store.resetPosition()
        }

        // Execute each command in sequence
        for (let i = 0; i < store.program.length; i++) {
            if (shouldStop) break

            store.setCurrentCommandIndex(i)
            const command = store.program[i]
            if (!command) continue

            const success = await executeCommand(command)

            if (!success) {
                store.setStatus('FAIL')
                store.setCurrentCommandIndex(-1)
                isExecuting.value = false
                return
            }

            await wait(store.executionSpeed)
        }

        store.setCurrentCommandIndex(-1)

        // Check win condition
        if (store.isWin) {
            store.setStatus('WIN')
            await wait(300)
            toast.add({
                title: '🎉 Bravo !',
                description: 'Tu as réussi le niveau !',
                color: 'success',
                icon: 'i-ph-trophy'
            })
        } else {
            store.setStatus('FAIL')
            toast.add({
                title: 'Pas tout à fait...',
                description: "Tu n'as pas allumé toutes les lumières. Réessaie !",
                color: 'warning',
                icon: 'i-ph-lightbulb'
            })
        }

        isExecuting.value = false
    }

    /**
     * Stops the current execution
     */
    const stop = () => {
        shouldStop = true
        isExecuting.value = false
        store.reset()
    }

    return {
        execute,
        stop,
        isExecuting
    }
}

