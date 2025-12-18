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
    label: 'AVANCER',
    icon: 'i-ph-arrow-up-bold',
    color: 'cyan',
    neon: 'border-neon-cyan'
  },
  TURN_L: {
    label: 'GAUCHE',
    icon: 'i-ph-arrow-counter-clockwise-bold',
    color: 'magenta',
    neon: 'border-neon-magenta'
  },
  TURN_R: {
    label: 'DROITE',
    icon: 'i-ph-arrow-clockwise-bold',
    color: 'magenta',
    neon: 'border-neon-magenta'
  },
  LIGHT: {
    label: 'ALLUMER',
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
  <div v-if="level" class="flex flex-col gap-6 h-full min-h-0">
    <!-- Zone Programme Principal -->
    <div class="flex-1 flex flex-col min-h-0">
      <div class="flex items-center justify-between mb-4 px-1">
        <h3 class="text-lg font-black uppercase tracking-[0.2em] text-magenta-500 italic flex items-center gap-2">
          <UIcon name="i-ph-terminal-window-fill" />
          PROGRAMME PRINCIPAL
        </h3>
        <div
          class="flex items-center gap-2 font-mono text-xs font-bold px-3 py-1 bg-cyber-950 border border-cyber-800 rounded-full">
          <span :class="canAddMore ? 'text-primary' : 'text-error'">{{ commandCount }}</span>
          <span class="text-cyber-600">/</span>
          <span class="text-cyber-400">{{ maxCommands }}</span>
        </div>
      </div>

      <div
        class="flex-1 min-h-[250px] p-4 bg-cyber-950/60 border-2 border-cyan-500/30 rounded-2xl overflow-y-auto custom-scrollbar relative">
        <VueDraggable v-model="program" :animation="200" handle=".drag-handle" @add="onAdd"
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <template #item="{ element, index }">
            <div :key="`cmd-${index}`"
              class="flex flex-col items-center justify-center p-4 bg-linear-to-br from-cyber-800 to-cyber-900 border-2 rounded-xl shadow-2xl hover:scale-[1.08] active:scale-95 transition-all cursor-move group relative min-h-[100px]"
              :class="[
                commandConfig[element as Command].neon,
                store.currentCommandIndex === index ? 'glow-box-cyan scale-110 z-10 border-white ring-2 ring-cyan-400' : 'border-cyber-700 hover:border-current'
              ]">
              <!-- Index marker -->
              <div class="absolute top-1 left-2 font-mono text-[8px] text-cyber-500 font-bold">{{ index + 1 }}</div>

              <div
                class="absolute top-1 right-1 drag-handle cursor-grab active:cursor-grabbing text-cyber-700 hover:text-cyber-400 p-1">
                <UIcon name="i-ph-dots-six-vertical-bold" class="w-3 h-3" />
              </div>

              <UIcon :name="commandConfig[element as Command].icon" class="w-8 h-8 text-white mb-2" />
              <span
                class="font-mono font-black uppercase text-[10px] tracking-tighter text-cyber-300 group-hover:text-white">{{
                  commandConfig[element as Command].label }}</span>

              <!-- Close button on hover -->
              <button @click.stop="removeBlock(index)"
                class="absolute -top-2 -right-2 w-5 h-5 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                <UIcon name="i-ph-x-bold" class="w-3 h-3" />
              </button>
            </div>
          </template>

          <template #footer>
            <div v-if="program.length === 0"
              class="col-span-full flex flex-col items-center justify-center py-12 text-cyber-500">
              <div class="relative mb-4">
                <div class="absolute inset-0 bg-magenta-500/10 blur-xl rounded-full animate-pulse"></div>
                <UIcon name="i-ph-code-block-duotone" class="w-16 h-16 relative z-10 opacity-20" />
              </div>
              <p class="text-[10px] font-mono uppercase tracking-[0.2em] text-center italic opacity-40 px-6">En attente
                d'instructions... Glisse des blocs ici.</p>
            </div>
          </template>
        </VueDraggable>
      </div>
    </div>

    <!-- Barre d'outils - Blocs disponibles -->
    <div class="pt-6 border-t border-cyber-800">
      <h3 class="text-sm font-black uppercase tracking-[0.2em] text-cyan-400 mb-5 px-1 flex items-center gap-2 italic">
        <UIcon name="i-ph-stack-fill" />
        BIBLIOTHÈQUE DE BLOCS
      </h3>
      <div class="flex flex-wrap gap-3 px-1">
        <button v-for="command in availableBlocks" :key="command" :disabled="!canAddMore" @click="addBlock(command)"
          class="flex flex-col items-center gap-2 p-4 min-w-[100px] bg-linear-to-b from-cyber-800 to-cyber-900 border-2 rounded-2xl transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed hover:enabled:scale-110 hover:enabled:shadow-[0_0_20px] shadow-lg group active:scale-95"
          :class="[
            commandConfig[command].neon,
            !canAddMore ? 'border-cyber-700' : 'hover:shadow-cyan-500/50'
          ]">
          <UIcon :name="commandConfig[command].icon"
            class="w-7 h-7 text-white group-hover:text-cyan-300 transition-colors" />
          <span
            class="text-[8px] font-black uppercase tracking-wider text-center font-mono text-cyber-300 group-hover:text-white transition-colors">{{
              commandConfig[command].label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
