<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type { SortableEvent } from 'sortablejs'
import type { Command } from '~/types/game'

const store = useGameStore()

const level = computed(() => store.currentLevel)
const program = computed({
  get: () => store.program,
  set: (value) => store.setProgram(value)
})

// Configuration des blocs de commande
const commandConfig: Record<Command, { label: string; icon: string; color: string; neon: string }> = {
  MOVE: {
    label: 'Avancer',
    icon: 'i-ph-arrow-up-bold',
    color: 'cyan',
    neon: 'border-neon-cyan'
  },
  TURN_L: {
    label: 'Tourner Gauche',
    icon: 'i-ph-arrow-counter-clockwise-bold',
    color: 'magenta',
    neon: 'border-neon-magenta'
  },
  TURN_R: {
    label: 'Tourner Droite',
    icon: 'i-ph-arrow-clockwise-bold',
    color: 'magenta',
    neon: 'border-neon-magenta'
  },
  LIGHT: {
    label: 'Allumer',
    icon: 'i-ph-lightbulb-fill',
    color: 'cyan',
    neon: 'border-neon-cyan'
  }
}

// Blocs disponibles pour le niveau actuel
const availableBlocks = computed(() => {
  if (!level.value) return []
  return level.value.availableBlocks
})

// Compteur de commandes
const commandCount = computed(() => store.programLength)
const maxCommands = computed(() => level.value?.maxCommands ?? 0)
const canAddMore = computed(() => commandCount.value < maxCommands.value)

// Gestion du drag and drop
const onAdd = (evt: SortableEvent) => {
  if (!canAddMore.value && evt.newIndex !== undefined) {
    const toast = useToast()
    toast.add({
      title: 'Limite atteinte',
      description: `Tu ne peux utiliser que ${maxCommands.value} commandes maximum !`,
      color: 'warning',
      icon: 'i-ph-warning-circle'
    })
    // Retire le bloc ajouté
    program.value.splice(evt.newIndex, 1)
  }
}

// Supprime un bloc
const removeBlock = (index: number) => {
  store.removeCommand(index)
}

// Ajoute un bloc depuis la barre d'outils
const addBlock = (command: Command) => {
  if (!canAddMore.value) {
    const toast = useToast()
    toast.add({
      title: 'Limite atteinte',
      description: `Tu ne peux utiliser que ${maxCommands.value} commandes maximum !`,
      color: 'warning',
      icon: 'i-ph-warning-circle'
    })
    return
  }
  store.addCommand(command)
}
</script>

<template>
  <div v-if="level" class="flex flex-col gap-4 h-full">
    <!-- Zone Programme Principal -->
    <div class="flex-1 flex flex-col min-h-0">
      <div class="flex items-center justify-between mb-3 px-2">
        <h3 class="text-xl font-black uppercase tracking-tighter text-magenta-500 italic flex items-center gap-2">
          <UIcon name="i-ph-terminal-window-fill" />
          Programme Principal
        </h3>
        <UBadge 
          :color="canAddMore ? 'primary' : 'error'" 
          variant="solid"
          size="md"
          class="font-mono font-bold glow-cyan"
        >
          {{ commandCount }} / {{ maxCommands }}
        </UBadge>
      </div>
      
      <div class="flex-1 min-h-0 p-4 bg-cyber-950/50 border-2 border-dashed border-cyber-800 rounded-xl overflow-y-auto custom-scrollbar">
        <VueDraggable
          v-model="program"
          :animation="200"
          handle=".drag-handle"
          item-key="index"
          @add="onAdd"
          class="space-y-3"
        >
          <template #item="{ element, index }">
            <div 
              class="flex items-center gap-3 p-4 bg-cyber-900 border-2 rounded-lg shadow-lg hover:scale-[1.02] transition-all cursor-move group"
              :class="commandConfig[element as Command].neon"
            >
              <div class="cursor-grab active:cursor-grabbing text-cyber-500 drag-handle group-hover:text-cyber-300">
                <UIcon name="i-ph-dots-six-vertical-bold" class="w-5 h-5" />
              </div>
              <UIcon :name="commandConfig[element as Command].icon" class="w-6 h-6 text-primary" />
              <span class="flex-1 font-mono font-black uppercase text-sm tracking-tight">{{ commandConfig[element as Command].label }}</span>
              <UButton
                icon="i-ph-x-bold"
                color="neutral"
                variant="ghost"
                size="xs"
                class="text-cyber-500 hover:text-error hover:bg-error/10"
                @click="removeBlock(index)"
              />
            </div>
          </template>
          
          <template #footer>
            <div v-if="program.length === 0" class="flex flex-col items-center justify-center py-12 text-cyber-500">
              <div class="relative mb-4">
                <div class="absolute inset-0 bg-magenta-500/10 blur-xl rounded-full animate-pulse"></div>
                <UIcon name="i-ph-code-block-fill" class="w-16 h-16 relative z-10 opacity-30" />
              </div>
              <p class="text-sm font-mono uppercase tracking-widest text-center italic opacity-60 px-4">En attente d'instructions... Glisse des blocs pour commencer.</p>
            </div>
          </template>
        </VueDraggable>
      </div>
    </div>

    <!-- Barre d'outils - Blocs disponibles -->
    <div class="pt-6 border-t border-cyber-800">
      <h3 class="text-lg font-black uppercase tracking-tighter text-cyan-400 mb-4 px-2 flex items-center gap-2 italic">
        <UIcon name="i-ph-stack-fill" />
        Bibliothèque de Blocs
      </h3>
      <div class="flex flex-wrap gap-3 p-2">
        <button
          v-for="command in availableBlocks"
          :key="command"
          :disabled="!canAddMore"
          @click="addBlock(command)"
          class="flex flex-col items-center gap-2 p-4 min-w-[100px] bg-cyber-900 border-2 rounded-xl transition-all disabled:opacity-30 disabled:grayscale hover:enabled:scale-110 shadow-lg group"
          :class="[
            commandConfig[command].neon,
            !canAddMore ? 'border-cyber-800' : ''
          ]"
        >
          <UIcon :name="commandConfig[command].icon" class="w-8 h-8 text-primary group-hover:glow-cyan" />
          <span class="text-[10px] font-black uppercase tracking-tighter text-center font-mono group-hover:text-white">{{ commandConfig[command].label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

