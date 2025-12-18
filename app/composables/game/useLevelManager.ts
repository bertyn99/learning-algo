import { computed } from 'vue'
import { useGameStore } from '~/stores/game'
import { LevelsSchema } from '~~/shared/schemas/level.zod'
import levelsData from '~/data/levels.json'

export const useLevelManager = () => {
    const store = useGameStore()

    /**
     * Validates the external levels data against the schema
     * Returns the validated data or throws if invalid
     */
    const validateLevels = () => {
        try {
            const validated = LevelsSchema.parse(levelsData)
            console.log('✅ Levels data validated successfully')
            return validated
        } catch (error) {
            console.error('❌ Levels data validation failed:', error)
            throw error
        }
    }

    /**
     * Loads a specific level by ID
     */
    const loadLevel = (levelId: number) => {
        validateLevels()
        store.loadLevel(levelId)
    }

    /**
     * Advances to the next available level
     */
    const nextLevel = () => {
        store.nextLevel()
    }

    /**
     * Resets the current level state
     */
    const resetLevel = () => {
        store.reset()
    }

    return {
        validateLevels,
        loadLevel,
        nextLevel,
        resetLevel,
        currentLevel: computed(() => store.currentLevel),
        hasNextLevel: computed(() => store.hasNextLevel),
        currentLevelId: computed(() => store.currentLevelId)
    }
}

