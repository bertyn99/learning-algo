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
  <div v-if="level" class="flex flex-col gap-3">
    <!-- Level Context Card (Title & Description) -->
    <div class="relative group">
      <div class="absolute -inset-1 bg-primary/20 blur opacity-40 group-hover:opacity-100 transition duration-1000">
      </div>
      <div class="relative p-3.5 bg-cyber-900 border border-cyber-800 rounded-xl overflow-hidden shadow-2xl">
        <div class="flex items-start justify-between mb-2">
          <h2 class="text-xl font-black text-primary uppercase tracking-tight italic glow-cyan">{{ level.title }}</h2>
          <div
            class="text-[9px] font-mono font-bold text-cyber-500 uppercase tracking-widest bg-cyber-950 px-1.5 py-0.5 rounded border border-cyber-800">
            LVL {{ level.id }}
          </div>
        </div>
        <p class="text-[11px] text-cyber-200 font-medium leading-tight italic border-l-2 border-magenta-500/50 pl-3 py-0.5">
          {{ level.description }}
        </p>
      </div>
    </div>

    <!-- Execution Controls (Play, Reset, Speed) -->
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2 mb-0.5 px-1">
        <UIcon name="i-ph-play-bold" class="text-primary w-3 h-3" />
        <span class="text-[10px] font-black text-cyber-400 uppercase tracking-[0.2em]">Exécution</span>
      </div>

      <div class="flex flex-col sm:flex-row gap-2">
        <!-- Main Run Button -->
        <UButton size="lg" :disabled="!canExecute" @click="handlePlay"
          class="flex-2 py-3 font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/50"
          :class="canExecute ? 'bg-linear-to-r from-cyan-600 to-cyan-500 text-white glow-cyan hover:shadow-[0_0_20px_rgba(0,212,255,0.6)]' : 'bg-cyber-800 text-cyber-600'">
          <template #leading>
            <UIcon name="i-ph-play-fill" class="w-5 h-5" />
          </template>
          EXÉCUTER
        </UButton>

        <!-- Action Buttons Row -->
        <div class="flex flex-1 gap-2">
          <!-- Reset Sub-button -->
          <UButton icon="i-ph-arrow-clockwise-bold" color="neutral" variant="outline" size="lg" @click="handleReset"
            class="flex-1 border-2 border-magenta-500/50 hover:border-magenta-400 hover:bg-magenta-500/10 text-magenta-400 hover:text-magenta-300 transition-all font-black uppercase tracking-widest text-[10px] shadow-md">
            RESET
          </UButton>

          <!-- Speed Toggle -->
          <UButton :icon="currentSpeed?.icon" color="secondary" variant="outline" size="lg" @click="toggleSpeed"
            class="flex-1 border-2 border-magenta-500/50 hover:border-magenta-400 hover:bg-magenta-500/10 text-magenta-400 hover:text-magenta-300 font-black uppercase tracking-widest text-[10px] min-w-[90px] transition-all shadow-md">
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
          class="p-3 border-2 border-neon-cyan bg-cyber-900/90 rounded-2xl shadow-[0_0_30px_rgba(0,212,255,0.3)] relative overflow-hidden">
          <div class="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent animate-pulse">
          </div>

          <div class="relative z-10 flex items-start justify-between gap-3">
            <div class="flex items-center gap-3 flex-1">
              <div class="p-2 bg-primary/20 rounded-lg glow-cyan flex-shrink-0">
                <UIcon name="i-ph-trophy-bold" class="w-5 h-5 text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-base font-black text-primary uppercase italic tracking-tighter glow-cyan leading-tight mb-0.5">Mission Réussie</h3>
                <p class="text-[10px] text-cyber-300 font-bold uppercase tracking-widest leading-tight">Systèmes opérationnels.</p>
              </div>
            </div>

            <UButton v-if="hasNextLevel" icon="i-ph-arrow-right-bold" size="md" variant="solid" color="primary"
              @click="handleNextLevel"
              class="font-black uppercase tracking-[0.2em] py-2 px-4 glow-cyan hover:scale-[1.02] active:scale-95 transition-all flex-shrink-0">
              Suivant
            </UButton>
          </div>
        </div>

        <!-- Failure Banner -->
        <div v-if="status === 'FAIL'"
          class="p-3 border border-neon-magenta bg-cyber-900/90 rounded-xl shadow-[0_0_20px_rgba(255,0,157,0.2)] relative overflow-hidden flex items-center justify-between gap-4">
          <div class="absolute inset-0 bg-linear-to-r from-secondary/5 via-transparent to-transparent animate-pulse">
          </div>

          <div class="relative z-10 flex items-center gap-3">
            <div class="p-1.5 bg-secondary/20 rounded-lg glow-magenta">
              <UIcon name="i-ph-warning-bold" class="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 class="text-xs font-black text-secondary uppercase italic tracking-tighter glow-magenta leading-none mb-0.5">Échec Système</h3>
              <p class="text-[9px] text-cyber-300 font-bold uppercase tracking-widest leading-none opacity-70">Erreur de séquence détectée.</p>
            </div>
          </div>

          <UButton icon="i-ph-arrow-clockwise-bold" size="sm" variant="solid" color="secondary"
            @click="handleReset"
            class="relative z-10 font-black uppercase tracking-widest py-2 px-4 glow-magenta hover:scale-[1.05] active:scale-95 transition-all text-[10px]">
            Réessayer
          </UButton>
        </div>
      </div>
    </Transition>
  </div>
</template>
