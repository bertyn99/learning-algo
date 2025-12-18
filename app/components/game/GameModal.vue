<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '~/stores/game'

const props = defineProps<{
  modelValue: boolean
  type: 'win' | 'fail'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const store = useGameStore()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const hasNextLevel = computed(() => store.hasNextLevel)

const handleNextLevel = () => {
  store.nextLevel()
  isOpen.value = false
}

const handleRetry = () => {
  store.reset()
  isOpen.value = false
}
</script>

<template>
  <UModal v-model="isOpen">
    <UCard class="bg-cyber-900 overflow-hidden border-4"
      :class="type === 'win' ? 'border-neon-cyan' : 'border-neon-magenta'">
      <template #header>
        <div v-if="type === 'win'" class="flex items-center gap-4 p-4 bg-cyan-500/10">
          <div class="p-3 bg-cyan-500/20 rounded-full glow-cyan">
            <UIcon name="i-ph-trophy-fill" class="w-12 h-12 text-primary" />
          </div>
          <h2 class="text-3xl font-black italic uppercase tracking-tighter text-cyan-400">Mission Réussie</h2>
        </div>
        <div v-else class="flex items-center gap-4 p-4 bg-magenta-500/10">
          <div class="p-3 bg-magenta-500/20 rounded-full glow-magenta">
            <UIcon name="i-ph-warning-circle-fill" class="w-12 h-12 text-secondary" />
          </div>
          <h2 class="text-3xl font-black italic uppercase tracking-tighter text-magenta-400">Échec Système</h2>
        </div>
      </template>

      <template #body>
        <div class="p-6 text-center">
          <p v-if="type === 'win'" class="text-xl text-cyber-200 font-mono italic">
            Niveau <span class="text-cyan-400 font-black">{{ store.currentLevelId }}</span> complété avec succès.
            <br>
            <span v-if="hasNextLevel" class="text-sm opacity-70 mt-4 block">Initialisation de la zone suivante...</span>
            <span v-else class="text-sm text-magenta-400 mt-4 block">PROTOCOLE FINAL TERMINÉ. VOUS ÊTES UN MAÎTRE !
              🏆</span>
          </p>
          <p v-else class="text-xl text-cyber-200 font-mono italic">
            Erreur logique détectée.
            <br>
            <span class="text-sm text-magenta-400 opacity-80 mt-4 block font-black uppercase">Vérifiez vos séquences
              d'instructions !</span>
          </p>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-center gap-4 pb-4">
          <UButton v-if="type === 'win' && hasNextLevel" icon="i-ph-arrow-right-bold" color="primary" size="xl"
            class="glow-cyan font-black uppercase tracking-widest px-8" @click="handleNextLevel">
            Suivant
          </UButton>
          <UButton v-else-if="type === 'win'" icon="i-ph-check-bold" color="primary" size="xl"
            class="glow-cyan font-black uppercase tracking-widest px-8" @click="isOpen = false">
            Terminer
          </UButton>
          <UButton v-else icon="i-ph-arrow-clockwise-bold" color="secondary" size="xl"
            class="glow-magenta font-black uppercase tracking-widest px-8" @click="handleRetry">
            Réessayer
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
