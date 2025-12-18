import { ref } from 'vue'
import { useGameStore } from '~/stores/game'
import type { Command, ProgramBlock } from '~/types/game'
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
        store.setActiveAction(command)

        let success = true
        switch (command) {
            case 'MOVE': {
                const delta = robot.getDirectionDelta(store.robot.dir)
                const newX = store.robot.x + delta.dx
                const newY = store.robot.y + delta.dy

                const oldX = store.robot.x
                const oldY = store.robot.y

                const currentTile = grid.getTileAt(oldX, oldY)
                const targetTile = grid.getTileAt(newX, newY)

                if (grid.isValidPosition(newX, newY) && targetTile && currentTile) {
                    if (targetTile.height === currentTile.height) {
                        store.moveRobot(newX, newY)
                        checkTileTriggers(newX, newY, 'enter')
                        checkTileTriggers(oldX, oldY, 'leave')
                        success = true
                        break
                    }
                }

                toast.add({
                    title: 'Oups !',
                    description: 'Le robot ne peut pas aller par là...',
                    color: 'error',
                    icon: 'i-ph-warning'
                })
                success = false
                break
            }

            case 'JUMP': {
                const delta = robot.getDirectionDelta(store.robot.dir)
                const newX = store.robot.x + delta.dx
                const newY = store.robot.y + delta.dy

                const oldX = store.robot.x
                const oldY = store.robot.y

                const currentTile = grid.getTileAt(oldX, oldY)
                const targetTile = grid.getTileAt(newX, newY)

                if (grid.isValidPosition(newX, newY) && targetTile && currentTile) {
                    const heightDelta = targetTile.height - currentTile.height
                    if (Math.abs(heightDelta) <= 1) {
                        store.moveRobot(newX, newY)
                        checkTileTriggers(newX, newY, 'enter')
                        checkTileTriggers(oldX, oldY, 'leave')
                        success = true
                        break
                    }
                }

                toast.add({
                    title: 'Saut impossible !',
                    description: 'C\'est trop haut ou trop bas...',
                    color: 'error',
                    icon: 'i-ph-warning'
                })
                success = false
                break
            }

            case 'TURN_L': {
                const newDir = robot.getTurnLeftDirection(store.robot.dir)
                store.turnRobot(newDir)
                success = true
                break
            }

            case 'TURN_R': {
                const newDir = robot.getTurnRightDirection(store.robot.dir)
                store.turnRobot(newDir)
                success = true
                break
            }

            case 'LIGHT': {
                store.lightCell()
                success = true
                break
            }

            default:
                success = true
                break
        }

        // Wait for animation to finish before clearing action
        await wait(store.executionSpeed * 0.8)
        store.setActiveAction(null)
        return success
    }

    const checkTileTriggers = (x: number, y: number, event: 'enter' | 'leave') => {
        const tile = grid.getTileAt(x, y)
        if (!tile) return

        if (event === 'enter') {
            if (tile.type === 'switch' && tile.targetId) {
                const currentState = store.interactiveState[tile.targetId] || false
                store.setInteractiveState(tile.targetId, !currentState)
            } else if (tile.type === 'teleport' && tile.targetId) {
                const targetTeleporter = store.currentLevel?.layout.find(t => t.id === tile.targetId)
                if (targetTeleporter) {
                    store.moveRobot(targetTeleporter.x, targetTeleporter.y)
                }
            }
        } else if (event === 'leave') {
            if (tile.type === 'cracked' && tile.id) {
                store.setInteractiveState(tile.id, false)
            }
        }
    }

    const executeBlockList = async (blocks: ProgramBlock[]): Promise<boolean> => {
        for (let i = 0; i < blocks.length; i++) {
            if (shouldStop) return false

            const block = blocks[i]
            store.setCurrentCommandIndex(i)

            let success = true
            if (block.type === 'LOOP' && block.children) {
                for (let j = 0; j < (block.iterations || 0); j++) {
                    if (shouldStop) break
                    success = await executeBlockList(block.children)
                    if (!success) break
                }
            } else if (block.type === 'IF_COLOR' && block.children) {
                const currentTile = grid.getTileAt(store.robot.x, store.robot.y)
                if (currentTile?.color === block.conditionColor) {
                    success = await executeBlockList(block.children)
                }
            } else if (block.type === 'COMMAND' && block.command) {
                success = await executeCommand(block.command)
            }

            if (!success) return false
            await wait(store.executionSpeed)
        }
        return true
    }

    /**
     * Runs the program sequence
     */
    const execute = async () => {
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

        store.resetPosition()

        const success = await executeBlockList(store.program)

        if (shouldStop) {
            isExecuting.value = false
            return
        }

        store.setCurrentCommandIndex(-1)

        if (success && store.isWin) {
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
            if (success) {
                toast.add({
                    title: 'Pas tout à fait...',
                    description: "Tu n'as pas allumé toutes les lumières. Réessaie !",
                    color: 'warning',
                    icon: 'i-ph-lightbulb'
                })
            }
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
        isExecuting,
        executeCommand
    }
}
