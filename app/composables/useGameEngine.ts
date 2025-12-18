import type { Direction, Command } from '~/types/game'

export const useGameEngine = () => {
    const store = useGameStore()
    const toast = useToast()

    const isExecuting = ref(false)
    let shouldStop = false

    // Mapping des directions
    const directions: Direction[] = ['N', 'E', 'S', 'W']

    // Calcule le delta de position selon la direction
    const getDirectionDelta = (dir: Direction): { dx: number; dy: number } => {
        switch (dir) {
            case 'N': return { dx: 0, dy: -1 }
            case 'E': return { dx: 1, dy: 0 }
            case 'S': return { dx: 0, dy: 1 }
            case 'W': return { dx: -1, dy: 0 }
        }
    }

    // Tourne à gauche
    const turnLeft = (currentDir: Direction): Direction => {
        const index = directions.indexOf(currentDir)
        if (index === -1) return 'N' // Fallback
        return directions[(index + 3) % 4] || 'N'
    }

    // Tourne à droite
    const turnRight = (currentDir: Direction): Direction => {
        const index = directions.indexOf(currentDir)
        if (index === -1) return 'N' // Fallback
        return directions[(index + 1) % 4] || 'N'
    }

    // Vérifie si une case est valide (dans la grille et sur le sol)
    const isValidPosition = (x: number, y: number): boolean => {
        const level = store.currentLevel
        if (!level) return false

        if (x < 0 || x >= level.gridSize || y < 0 || y >= level.gridSize) {
            return false
        }

        const index = y * level.gridSize + x
        const cellType = level.layout[index]
        return cellType === 1 || cellType === 2 // Sol ou cible
    }

    // Attend un délai
    const wait = (ms: number): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    // Exécute une commande
    const executeCommand = async (command: Command): Promise<boolean> => {
        console.log(`⚡ Executing command: ${command}`)

        switch (command) {
            case 'MOVE': {
                const delta = getDirectionDelta(store.robot.dir)
                const newX = store.robot.x + delta.dx
                const newY = store.robot.y + delta.dy

                console.log(`🚶 Moving from (${store.robot.x}, ${store.robot.y}) to (${newX}, ${newY})`)

                if (isValidPosition(newX, newY)) {
                    store.moveRobot(newX, newY)
                    console.log(`✅ Move successful! New position: (${newX}, ${newY})`)
                    return true
                } else {
                    console.log(`❌ Move failed! Invalid position: (${newX}, ${newY})`)
                    // Le robot essaie de sortir ou d'aller sur une case vide
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
                const newDir = turnLeft(store.robot.dir)
                console.log(`↶ Turning left from ${store.robot.dir} to ${newDir}`)
                store.turnRobot(newDir)
                return true
            }

            case 'TURN_R': {
                const newDir = turnRight(store.robot.dir)
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

    // Lance l'exécution du programme
    const execute = async () => {
        console.log('🚀 Starting program execution')
        console.log('📋 Program:', store.program)
        console.log('🤖 Robot position:', store.robot)

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
        // Only reset position, not the status or program
        const level = store.currentLevel
        if (level) {
            console.log('🎯 Level goals:', level.goals)
            console.log('📍 Starting position:', level.start)
            store.moveRobot(level.start.x, level.start.y)
            store.turnRobot(level.start.dir)
            store.litGoals = []
            store.currentCommandIndex = -1
        }

        // Exécute chaque commande
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

        // Vérifie la victoire
        console.log('🏁 Checking win condition...')
        console.log('🎯 Goals to light:', level?.goals)
        console.log('💡 Lit goals:', store.litGoals)
        console.log('✅ Is win?', store.isWin)

        if (store.isWin) {
            store.setStatus('WIN')

            // Confettis !
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
                description: 'Tu n\'as pas allumé toutes les lumières. Réessaie !',
                color: 'warning',
                icon: 'i-ph-lightbulb'
            })
        }

        isExecuting.value = false
    }

    // Arrête l'exécution
    const stop = () => {
        shouldStop = true
        isExecuting.value = false
        store.reset()
    }

    // Change la vitesse
    const setSpeed = (speed: number) => {
        store.setSpeed(speed)
    }

    return {
        execute,
        stop,
        setSpeed,
        isExecuting
    }
}

