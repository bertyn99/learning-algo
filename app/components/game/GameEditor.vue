<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type { SortableEvent } from 'sortablejs'
import { computed, ref, watch } from 'vue'
import type { Command } from '~/types/game'
import { useGameStore } from '~/stores/game'

const store = useGameStore()

const level = computed(() => store.currentLevel)
const program = computed({
  get: () => store.program,
  set: (value) => store.setProgram(value)
})

// Dragging state for visual feedback
const isDragging = ref(false)
const draggedIndex = ref<number | null>(null)

// Force re-render when program changes
const programKey = ref(0)
watch(program, () => {
  programKey.value++
})

// Configuration des blocs de commande
const commandConfig: Record<Command, { label: string; icon: string; color: string; neon: string; bgGradient: string }> = {
  MOVE: {
    label: 'AVANCER',
    icon: 'i-ph-arrow-up-bold',
    color: 'cyan',
    neon: 'border-neon-cyan',
    bgGradient: 'from-cyan-900/30 to-cyan-800/20'
  },
  TURN_L: {
    label: 'GAUCHE',
    icon: 'i-ph-arrow-counter-clockwise-bold',
    color: 'magenta',
    neon: 'border-neon-magenta',
    bgGradient: 'from-magenta-900/30 to-magenta-800/20'
  },
  TURN_R: {
    label: 'DROITE',
    icon: 'i-ph-arrow-clockwise-bold',
    color: 'magenta',
    neon: 'border-neon-magenta',
    bgGradient: 'from-magenta-900/30 to-magenta-800/20'
  },
  LIGHT: {
    label: 'ALLUMER',
    icon: 'i-ph-lightbulb-fill',
    color: 'cyan',
    neon: 'border-neon-cyan',
    bgGradient: 'from-cyan-900/30 to-cyan-800/20'
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
const progress = computed(() => (commandCount.value / maxCommands.value) * 100)

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

const onDragStart = (index: number) => {
  isDragging.value = true
  draggedIndex.value = index
}

const onDragEnd = () => {
  isDragging.value = false
  draggedIndex.value = null
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
  <div v-if="level" class="flex flex-col gap-5 h-full min-h-0">
    <!-- Zone Programme Principal Header -->
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-sm font-black uppercase tracking-[0.2em] text-magenta-500 italic flex items-center gap-2">
        <UIcon name="i-ph-terminal-window-fill" />
        PROGRAMME PRINCIPAL
      </h3>
      <!-- Progress indicator -->
      <div class="flex items-center gap-3">
        <div class="text-xs font-mono font-bold text-cyber-400">
          <span :class="canAddMore ? 'text-primary font-bold' : 'text-error'">{{ commandCount }}</span>
          <span class="text-cyber-600">/</span>
          <span>{{ maxCommands }}</span>
        </div>
        <div class="w-20 h-1.5 bg-cyber-900 rounded-full overflow-hidden border border-cyber-700">
          <div class="h-full bg-linear-to-r from-cyan-500 to-magenta-500 transition-all duration-300"
            :style="{ width: `${progress}%` }"></div>
        </div>
      </div>
    </div>

    <!-- Programme area -->
    <div
      class="flex-1 min-h-[250px] p-3 bg-cyber-950/60 border-2 border-magenta-500/30 rounded-2xl overflow-y-auto custom-scrollbar relative transition-all duration-300"
      :class="isDragging && 'border-magenta-500/60 bg-cyber-950/80 shadow-[0_0_30px_rgba(255,0,157,0.2)]'">

      <VueDraggable :key="programKey" v-model="program" :animation="200" handle=".drag-handle" @add="onAdd"
        @dragstart="onDragStart" @dragend="onDragEnd"
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 auto-rows-max">

        <!-- Command blocks -->
        <div v-for="(command, index) in program" :key="`cmd-${programKey}-${index}`"
          class="flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all duration-200 cursor-move group relative min-h-[90px]"
          :class="[
            commandConfig[command as Command].neon,
            `bg-linear-to-br ${commandConfig[command as Command].bgGradient}`,
            isDragging && draggedIndex === index ? 'opacity-50 scale-95 border-magenta-400' : 'hover:scale-[1.05]',
            store.currentCommandIndex === index ? 'ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(0,212,255,0.6)] scale-105 z-20' : 'shadow-lg hover:shadow-xl'
          ]">

          <!-- Step number badge -->
          <div
            class="absolute -top-2 -left-2 w-5 h-5 bg-linear-to-br from-magenta-500 to-magenta-600 rounded-full flex items-center justify-center font-mono text-[9px] font-black text-white shadow-lg">
            {{ index + 1 }}
          </div>

          <!-- Drag handle (improved) -->
          <div
            class="absolute top-1 right-1 drag-handle cursor-grab active:cursor-grabbing text-cyber-600 hover:text-cyan-400 p-1 transition-colors"
            title="Drag to reorder">
            <UIcon name="i-ph-dots-six-vertical-bold" class="w-4 h-4" />
          </div>

          <!-- Command icon and label -->
          <UIcon :name="commandConfig[command as Command].icon" class="w-7 h-7 text-white mb-1" />
          <span
            class="font-mono font-black uppercase text-[9px] tracking-tight text-cyan-100 text-center leading-tight">
            {{ commandConfig[command as Command].label }}
          </span>

          <!-- Delete button -->
          <button @click.stop="removeBlock(index)"
            class="absolute -top-2 -right-2 w-5 h-5 bg-red-500/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110 duration-200"
            title="Delete block">
            <UIcon name="i-ph-x-bold" class="w-3 h-3" />
          </button>
        </div>

        <!-- Empty state -->
        <div v-if="program.length === 0"
          class="col-span-full flex flex-col items-center justify-center py-8 text-cyber-500">
          <div class="relative mb-3">
            <div class="absolute inset-0 bg-magenta-500/5 blur-xl rounded-full animate-pulse"></div>
            <UIcon name="i-ph-code-block-duotone" class="w-14 h-14 relative z-10 opacity-30" />
          </div>
          <p class="text-[10px] font-mono uppercase tracking-[0.15em] text-center italic opacity-50 px-4">
            Ajoute des blocs pour commencer
          </p>
        </div>
      </VueDraggable>
    </div>

    <!-- Divider -->
    <div class="h-px bg-linear-to-r from-transparent via-cyber-700 to-transparent"></div>

    <!-- Barre d'outils - Blocs disponibles -->
    <div>
      <h3 class="text-xs font-black uppercase tracking-[0.2em] text-cyan-400 mb-3 px-1 flex items-center gap-2 italic">
        <UIcon name="i-ph-stack-fill" />
        BIBLIOTHÈQUE DE BLOCS
      </h3>
      <div class="flex flex-wrap gap-2">
        <button v-for="command in availableBlocks" :key="command" :disabled="!canAddMore" @click="addBlock(command)"
          class="flex flex-col items-center gap-1 p-3 min-w-[85px] border-2 rounded-xl transition-all shadow-lg font-black uppercase text-[8px] tracking-widest"
          :class="[
            commandConfig[command].neon,
            `bg-linear-to-b ${commandConfig[command].bgGradient}`,
            !canAddMore
              ? 'opacity-40 cursor-not-allowed border-cyber-700 grayscale'
              : 'hover:scale-110 hover:shadow-[0_0_15px] active:scale-95 group cursor-pointer'
          ]">
          <UIcon :name="commandConfig[command].icon"
            class="w-5 h-5 text-white transition-transform group-hover:scale-110" />
          <span class="text-cyber-300 group-hover:text-white transition-colors">
            {{ commandConfig[command].label }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
