<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type { SortableEvent } from 'sortablejs'
import { computed, ref, watch } from 'vue'
import type { Command, ProgramBlock, BlockType } from '~/types/game'
import { useGameStore } from '~/stores/game'
import ProgramBlockComponent from './ProgramBlock.vue'

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
}, { deep: true })

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
  JUMP: {
    label: 'SAUTER',
    icon: 'i-ph-unite-bold',
    color: 'cyan',
    neon: 'border-neon-cyan',
    bgGradient: 'from-cyan-900/30 to-cyan-800/20'
  },
  LIGHT: {
    label: 'ALLUMER',
    icon: 'i-ph-lightbulb-fill',
    color: 'cyan',
    neon: 'border-neon-cyan',
    bgGradient: 'from-cyan-900/30 to-cyan-800/20'
  },
  P1: {
    label: 'PROC 1',
    icon: 'i-ph-function-bold',
    color: 'yellow',
    neon: 'border-neon-yellow',
    bgGradient: 'from-yellow-900/30 to-yellow-800/20'
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
const removeBlock = (id: string) => {
  store.removeCommand(id)
}

// Ajoute un bloc depuis la barre d'outils
const addBlock = (command: Command | BlockType) => {
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

// Handle clones from toolbox
const cloneBlock = (block: Command | BlockType) => {
  const isContainer = ['LOOP', 'IF_COLOR'].includes(block)
  return {
    id: Math.random().toString(36).substring(2, 9),
    type: isContainer ? block as BlockType : 'COMMAND',
    command: !isContainer ? block as Command : undefined,
    children: isContainer ? [] : undefined,
    iterations: block === 'LOOP' ? 2 : undefined,
    conditionColor: block === 'IF_COLOR' ? 'red' : undefined
  }
}
</script>

<template>
  <div v-if="level" class="flex flex-col gap-3 h-full min-h-0">
    <!-- Zone Programme Principal Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-[11px] font-black uppercase tracking-[0.2em] text-magenta-500 italic flex items-center gap-2">
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
      class="flex-1 min-h-[250px] p-2 bg-cyber-950/60 border-2 border-magenta-500/30 rounded-2xl overflow-y-auto custom-scrollbar relative transition-all duration-300"
      :class="isDragging && 'border-magenta-500/60 bg-cyber-950/80 shadow-[0_0_30px_rgba(255,0,157,0.2)]'">

      <VueDraggable 
        :key="programKey" 
        v-model="program" 
        group="program"
        :animation="200" 
        handle=".drag-handle" 
        @add="onAdd"
        @dragstart="onDragStart" 
        @dragend="onDragEnd"
        class="flex flex-col gap-2 min-h-full"
      >
        <!-- Command blocks -->
        <ProgramBlockComponent
          v-for="(block, index) in program" 
          :key="block.id"
          :block="block"
          :index="index"
          :is-dragging="isDragging"
          :dragged-index="draggedIndex"
          :current-command-index="store.currentCommandIndex"
          :command-config="commandConfig"
          @remove="removeBlock"
          @update:children="(val) => block.children = val"
        />

        <!-- Empty state -->
        <div v-if="program.length === 0"
          class="flex-1 flex flex-col items-center justify-center py-8 text-cyber-500">
          <div class="relative mb-3">
            <div class="absolute inset-0 bg-magenta-500/5 blur-xl rounded-full animate-pulse"></div>
            <UIcon name="i-ph-code-block-duotone" class="w-14 h-14 relative z-10 opacity-30" />
          </div>
          <p class="text-[10px] font-mono uppercase tracking-[0.15em] text-center italic opacity-50 px-4">
            Glisse des blocs ici pour commencer
          </p>
        </div>
      </VueDraggable>
    </div>

    <!-- Divider -->
    <div class="h-px bg-linear-to-r from-transparent via-cyber-700 to-transparent"></div>

    <!-- Barre d'outils - Blocs disponibles -->
    <div>
      <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-2 px-1 flex items-center gap-2 italic">
        <UIcon name="i-ph-stack-fill" />
        BIBLIOTHÈQUE DE BLOCS
      </h3>
      
      <VueDraggable
        :model-value="availableBlocks"
        :group="{ name: 'program', pull: 'clone', put: false }"
        :sort="false"
        :clone="cloneBlock"
        class="flex flex-wrap gap-1.5"
      >
        <div v-for="command in (availableBlocks as (Command | BlockType)[])" :key="command"
          class="flex flex-col items-center gap-0.5 p-1.5 min-w-[65px] border-2 rounded-lg transition-all shadow-lg font-black uppercase text-[7px] tracking-widest"
          :class="[
            ['LOOP', 'IF_COLOR'].includes(command) ? 'border-neon-orange' : (commandConfig[command as Command]?.neon || 'border-cyber-700'),
            ['LOOP', 'IF_COLOR'].includes(command) ? 'bg-linear-to-b from-orange-900/30 to-orange-800/20' : (commandConfig[command as Command] ? `bg-linear-to-b ${commandConfig[command as Command].bgGradient}` : 'bg-cyber-800'),
            !canAddMore
              ? 'opacity-40 cursor-not-allowed border-cyber-700 grayscale'
              : 'hover:scale-105 hover:shadow-[0_0_10px] active:scale-95 group cursor-pointer'
          ]"
          @click="addBlock(command)">
          <UIcon :name="['LOOP', 'IF_COLOR'].includes(command) ? (command === 'LOOP' ? 'i-ph-repeat-bold' : 'i-ph-question-bold') : (commandConfig[command as Command]?.icon || 'i-ph-cube')"
            class="w-4 h-4 text-white transition-transform group-hover:scale-110" />
          <span class="text-cyber-300 group-hover:text-white transition-colors">
            {{ ['LOOP', 'IF_COLOR'].includes(command) ? command : (commandConfig[command as Command]?.label || command) }}
          </span>
        </div>
      </VueDraggable>
    </div>
  </div>
</template>
