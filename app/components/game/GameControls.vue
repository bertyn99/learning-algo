<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '~/stores/game'
import { useGameEngine } from '~/composables/useGameEngine'

const store = useGameStore()
const engine = useGameEngine()

const level = computed(() => store.currentLevel)
const status = computed(() => store.status)
const canExecute = computed(() => store.canExecute)
const isWin = computed(() => store.isWin)
const hasNextLevel = computed(() => store.hasNextLevel)

// Vitesses disponibles
const speeds = [
  { value: 1000, label: 'LENT', icon: 'i-ph-turtle-bold' },
  { value: 500, label: 'NORMAL', icon: 'i-ph-clock-bold' },
  { value: 250, label: 'RAPIDE', icon: 'i-ph-lightning-bold' }
]

const currentSpeedIndex = computed(() => {
  const index = speeds.findIndex(s => s.value === store.executionSpeed)
  return index >= 0 ? index : 1
})

const currentSpeed = computed(() => speeds[currentSpeedIndex.value] || speeds[1])

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
  <div v-if="level" class="flex flex-col gap-5">
    <!-- Level Context Card (Title & Description) -->
    <div class="relative group">
      <div class="absolute -inset-1 bg-primary/20 blur opacity-40 group-hover:opacity-100 transition duration-1000">
      </div>
      <div class="relative p-5 bg-cyber-900 border border-cyber-800 rounded-xl overflow-hidden shadow-2xl">
        <div class="flex items-start justify-between mb-3">
          <h2 class="text-2xl font-black text-primary uppercase tracking-tight italic glow-cyan">{{ level.title }}</h2>
          <div
            class="text-[10px] font-mono font-bold text-cyber-500 uppercase tracking-widest bg-cyber-950 px-2 py-1 rounded border border-cyber-800">
            LVL {{ level.id }} / {{ store.levels.length }}
          </div>
        </div>
        <p class="text-cyber-200 font-medium leading-relaxed italic border-l-2 border-magenta-500/50 pl-4 py-1">
          {{ level.description }}
        </p>
      </div>
    </div>

    <!-- Execution Controls (Play, Reset, Speed) -->
    <div class="flex flex-col gap-3">
      <div class="flex items-center gap-2 mb-1 px-1">
        <UIcon name="i-ph-play-bold" class="text-primary w-4 h-4" />
        <span class="text-xs font-black text-cyber-400 uppercase tracking-[0.2em]">Exécution</span>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Main Run Button -->
        <UButton size="xl" :disabled="!canExecute" @click="handlePlay"
          class="flex-2 py-4 font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.05] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/50"
          :class="canExecute ? 'bg-linear-to-r from-cyan-600 to-cyan-500 text-white glow-cyan hover:shadow-[0_0_30px_rgba(0,212,255,0.6)]' : 'bg-cyber-800 text-cyber-600'">
          <template #leading>
            <UIcon name="i-ph-play-fill" class="w-6 h-6" />
          </template>
          EXÉCUTER
        </UButton>

        <!-- Action Buttons Row -->
        <div class="flex flex-1 gap-2">
          <!-- Reset Sub-button -->
          <UButton icon="i-ph-arrow-clockwise-bold" color="neutral" variant="outline" size="xl" @click="handleReset"
            class="flex-1 border-2 border-magenta-500/50 hover:border-magenta-400 hover:bg-magenta-500/10 text-magenta-400 hover:text-magenta-300 transition-all font-black uppercase tracking-widest text-xs shadow-md">
            RESET
          </UButton>

          <!-- Speed Toggle -->
          <UButton :icon="currentSpeed?.icon" color="secondary" variant="outline" size="xl" @click="toggleSpeed"
            class="flex-1 border-2 border-magenta-500/50 hover:border-magenta-400 hover:bg-magenta-500/10 text-magenta-400 hover:text-magenta-300 font-black uppercase tracking-widest text-xs min-w-[110px] transition-all shadow-md">
            {{ currentSpeed?.label }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- Success/Failure Feedback Overlay -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
      <div v-if="status === 'WIN' || status === 'FAIL'" class="mt-4 flex flex-col gap-4">
        <!-- Success Banner -->
        <div v-if="status === 'WIN'"
          class="p-5 border-2 border-neon-cyan bg-cyber-900/90 rounded-2xl shadow-[0_0_30px_rgba(0,212,255,0.3)] relative overflow-hidden">
          <div class="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent animate-pulse">
          </div>

          <div class="relative z-10 flex flex-col items-center">
            <div class="flex items-center gap-4 mb-6 w-full">
              <div class="p-3 bg-primary/20 rounded-xl glow-cyan">
                <UIcon name="i-ph-trophy-bold" class="w-8 h-8 text-primary" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-black text-primary uppercase italic tracking-tighter glow-cyan">Mission Réussie
                </h3>
                <p class="text-xs text-cyber-300 font-bold uppercase tracking-widest">Systèmes opérationnels.</p>
              </div>
            </div>

            <UButton v-if="hasNextLevel" icon="i-ph-arrow-right-bold" block size="xl" variant="solid" color="primary"
              @click="handleNextLevel"
              class="font-black uppercase tracking-[0.2em] py-4 glow-cyan hover:scale-[1.02] active:scale-95 transition-all">
              Suivant
            </UButton>
          </div>
        </div>

        <!-- Failure Banner -->
        <div v-if="status === 'FAIL'"
          class="p-5 border-2 border-neon-magenta bg-cyber-900/90 rounded-2xl shadow-[0_0_30px_rgba(255,0,157,0.3)] relative overflow-hidden">
          <div class="absolute inset-0 bg-linear-to-br from-secondary/5 via-transparent to-transparent animate-pulse">
          </div>

          <div class="relative z-10 flex flex-col items-center">
            <div class="flex items-center gap-4 mb-6 w-full">
              <div class="p-3 bg-secondary/20 rounded-xl glow-magenta">
                <UIcon name="i-ph-warning-bold" class="w-8 h-8 text-secondary" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-black text-secondary uppercase italic tracking-tighter glow-magenta">Échec
                  Système
                </h3>
                <p class="text-xs text-cyber-300 font-bold uppercase tracking-widest">Erreur de séquence détectée.</p>
              </div>
            </div>

            <UButton icon="i-ph-arrow-clockwise-bold" block size="xl" variant="solid" color="secondary"
              @click="handleReset"
              class="font-black uppercase tracking-[0.2em] py-4 glow-magenta hover:scale-[1.02] active:scale-95 transition-all">
              Réessayer
            </UButton>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
