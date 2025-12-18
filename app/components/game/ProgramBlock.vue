<script setup lang="ts">
import { computed } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import type { ProgramBlock, Command, BlockType } from '~/types/game'

const props = defineProps<{
  block: ProgramBlock
  index: number
  isDragging?: boolean
  draggedIndex?: number | null
  currentCommandIndex?: number
  commandConfig: Record<Command, { label: string; icon: string; color: string; neon: string; bgGradient: string }>
}>()

const emit = defineEmits<{
  (e: 'remove', id: string): void
  (e: 'update:children', children: ProgramBlock[]): void
}>()

const children = computed({
  get: () => props.block.children || [],
  set: (value) => emit('update:children', value)
})

const onAdd = () => {
  // Logic to check limit could be here, but usually handled by parent
}
</script>

<template>
  <div
    class="flex flex-col p-1.5 border-2 rounded-lg transition-all duration-200 cursor-move group relative min-h-[36px]"
    :class="[
      block.command ? commandConfig[block.command].neon : (block.type === 'LOOP' ? 'border-neon-orange' : 'border-neon-yellow'),
      block.command ? `bg-linear-to-br ${commandConfig[block.command].bgGradient}` : (block.type === 'LOOP' ? 'bg-linear-to-br from-orange-900/30 to-orange-800/20' : 'bg-linear-to-br from-yellow-900/30 to-yellow-800/20'),
      isDragging && draggedIndex === index ? 'opacity-50 scale-95 border-magenta-400' : 'hover:shadow-lg',
      currentCommandIndex === index ? 'ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(0,212,255,0.5)] scale-105 z-20' : ''
    ]"
  >
    <!-- Step number badge -->
    <div
      class="absolute -top-1 -left-1 w-3.5 h-3.5 bg-linear-to-br from-magenta-500 to-magenta-600 rounded-full flex items-center justify-center font-mono text-[7px] font-black text-white shadow-lg z-10"
    >
      {{ index + 1 }}
    </div>

    <!-- Drag handle -->
    <div
      class="absolute top-0 right-0 drag-handle cursor-grab active:cursor-grabbing text-cyber-600 hover:text-cyan-400 p-0.5 transition-colors z-10"
    >
      <UIcon name="i-ph-dots-six-vertical-bold" class="w-3 h-3" />
    </div>

    <!-- Delete button -->
    <button
      @click.stop="emit('remove', block.id)"
      class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110 duration-200 z-30"
    >
      <UIcon name="i-ph-x-bold" class="w-2 h-2" />
    </button>

    <!-- Block Content -->
    <div class="flex flex-col flex-1">
      <template v-if="block.type === 'COMMAND' && block.command">
        <div class="flex items-center gap-2 py-0.5">
          <UIcon :name="commandConfig[block.command].icon" class="w-4 h-4 text-white" />
          <span class="font-mono font-black uppercase text-[9px] tracking-widest text-cyan-100 leading-none">
            {{ commandConfig[block.command].label }}
          </span>
        </div>
      </template>

      <template v-else-if="block.type === 'LOOP'">
        <div class="flex items-center gap-1.5 mb-1 py-0.5">
          <UIcon name="i-ph-repeat-bold" class="w-3.5 h-3.5 text-white" />
          <span class="font-mono font-black uppercase text-[8px] tracking-wider text-orange-200">
            REPEAT {{ block.iterations }}x
          </span>
        </div>
        
        <!-- Nested Draggable -->
        <VueDraggable
          v-model="children"
          group="program"
          :animation="200"
          handle=".drag-handle"
          class="w-full min-h-[30px] p-1 bg-black/40 rounded-lg border border-orange-500/30 flex flex-col gap-1"
        >
          <div v-for="(child, childIdx) in children" :key="child.id">
            <!-- Recursive call -->
            <ProgramBlock
              :block="child"
              :index="childIdx"
              :command-config="commandConfig"
              @remove="emit('remove', $event)"
              @update:children="(val) => child.children = val"
            />
          </div>
        </VueDraggable>
      </template>

      <template v-else-if="block.type === 'IF_COLOR'">
        <div class="flex items-center gap-1.5 mb-1 py-0.5">
          <UIcon name="i-ph-question-bold" class="w-3.5 h-3.5 text-white" />
          <span class="font-mono font-black uppercase text-[8px] tracking-wider text-yellow-200">
            IF {{ block.conditionColor }}
          </span>
        </div>

        <!-- Nested Draggable -->
        <VueDraggable
          v-model="children"
          group="program"
          :animation="200"
          handle=".drag-handle"
          class="w-full min-h-[30px] p-1 bg-black/40 rounded-lg border border-yellow-500/30 flex flex-col gap-1"
        >
          <div v-for="(child, childIdx) in children" :key="child.id">
            <ProgramBlock
              :block="child"
              :index="childIdx"
              :command-config="commandConfig"
              @remove="emit('remove', $event)"
              @update:children="(val) => child.children = val"
            />
          </div>
        </VueDraggable>
      </template>
    </div>
  </div>
</template>

