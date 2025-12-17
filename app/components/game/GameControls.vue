<script setup lang="ts">
const store = useGameStore()
const engine = useGameEngine()

const level = computed(() => store.currentLevel)
const status = computed(() => store.status)
const canExecute = computed(() => store.canExecute)
const isWin = computed(() => store.isWin)
const hasNextLevel = computed(() => store.hasNextLevel)

// Vitesses disponibles (en ms)
const speeds = [
  { value: 1000, label: 'Lent', icon: 'i-ph-turtle' },
  { value: 500, label: 'Normal', icon: 'i-ph-clock' },
  { value: 250, label: 'Rapide', icon: 'i-ph-lightning' }
]

const currentSpeedIndex = computed(() => {
  const index = speeds.findIndex(s => s.value === store.executionSpeed)
  return index >= 0 ? index : 1
})

const currentSpeed = computed(() => {
  const index = currentSpeedIndex.value
  return speeds[index] || speeds[1]
})

// Change la vitesse
const toggleSpeed = () => {
  const nextIndex = (currentSpeedIndex.value + 1) % speeds.length
  const nextSpeed = speeds[nextIndex]
  if (nextSpeed && engine) {
    engine.setSpeed(nextSpeed.value)
  }
}

// Lance l'exécution
const handlePlay = async () => {
  if (canExecute.value && engine) {
    await engine.execute()
  }
}

// Reset
const handleReset = () => {
  engine?.stop()
  store.reset()
}

// Niveau suivant
const handleNextLevel = () => {
  store.nextLevel()
}
</script>

<template>
  <div v-if="level" class="flex flex-col gap-4">
    <!-- Header avec niveau -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between p-4 bg-cyber-900/50 border border-cyber-800 rounded-lg">
      <div class="flex-1">
        <h2 class="text-xl font-black mb-1 text-cyan-400 uppercase tracking-tight">{{ level.title }}</h2>
        <p class="text-sm text-cyber-300 leading-relaxed italic">{{ level.description }}</p>
      </div>
      <UBadge size="lg" variant="subtle" color="secondary" class="whitespace-nowrap font-mono font-bold border-neon-magenta">
        LVL {{ level.id }} / {{ store.levels.length }}
      </UBadge>
    </div>

    <!-- Boutons de contrôle -->
    <div class="flex flex-col gap-3 sm:flex-row mt-2">
      <UButton
        icon="i-ph-play-fill"
        color="primary"
        size="xl"
        :disabled="!canExecute"
        @click="handlePlay"
        class="flex-1 font-black uppercase tracking-widest glow-cyan transition-all hover:scale-105"
      >
        EXÉCUTER
      </UButton>
      
      <div class="flex gap-2 sm:w-auto">
        <UButton
          icon="i-ph-arrow-clockwise-bold"
          color="neutral"
          variant="outline"
          size="xl"
          @click="handleReset"
          class="flex-1 sm:flex-none border-2 hover:border-magenta-500 hover:text-magenta-500 transition-all font-bold"
        >
          RESET
        </UButton>
        
        <UButton
          :icon="currentSpeed?.icon || 'i-ph-clock-bold'"
          color="secondary"
          variant="outline"
          size="xl"
          @click="toggleSpeed"
          class="flex-1 sm:flex-none border-2 font-bold min-w-[120px]"
        >
          {{ currentSpeed?.label.toUpperCase() || 'NORMAL' }}
        </UButton>
      </div>
    </div>

    <!-- Bouton niveau suivant (Success Feedback) -->
    <UCard v-if="isWin" class="mt-4 border-2 border-neon-cyan bg-cyber-900/90 shadow-[0_0_20px_rgba(57,255,20,0.3)]">
      <template #body>
        <div class="flex items-center gap-4 py-2">
          <div class="p-3 bg-cyan-500/20 rounded-full glow-cyan">
            <UIcon name="i-ph-trophy-fill" class="w-10 h-10 text-primary" />
          </div>
          <div>
            <h3 class="text-2xl font-black text-cyan-400 uppercase italic tracking-tighter">Mission Accomplie ! 🎉</h3>
            <p class="text-sm text-cyber-300 font-medium">Systèmes opérationnels. Prêt pour la suite ?</p>
          </div>
        </div>
      </template>
      <template #footer>
        <UButton
          v-if="hasNextLevel"
          icon="i-ph-arrow-right-bold"
          color="primary"
          size="xl"
          block
          class="font-black uppercase tracking-widest glow-cyan"
          @click="handleNextLevel"
        >
          Niveau Suivant
        </UButton>
        <UButton
          v-else
          icon="i-ph-crown-fill"
          color="secondary"
          size="xl"
          block
          disabled
          class="font-black uppercase tracking-widest opacity-80"
        >
          Maître du Code
        </UButton>
      </template>
    </UCard>
  </div>
</template>

