<script setup lang="ts">
import type { CellType } from '~/types/game'

const store = useGameStore()

const level = computed(() => store.currentLevel)

// Calcule les styles pour chaque cellule
const getCellClass = (cellType: CellType, x: number, y: number): string => {
  const classes = ['cell']
  
  // Type de cellule
  if (cellType === 0) {
    classes.push('cell-empty')
  } else if (cellType === 1) {
    classes.push('cell-floor')
  } else if (cellType === 2) {
    classes.push('cell-goal')
  }
  
  // Vérifie si la cellule est allumée
  const isLit = store.litGoals.some(goal => goal.x === x && goal.y === y)
  if (isLit && cellType === 2) {
    classes.push('cell-lit')
  }
  
  // Vérifie si c'est la position actuelle du robot
  const isRobotHere = store.robot.x === x && store.robot.y === y
  if (isRobotHere) {
    classes.push('cell-robot')
  }
  
  return classes.join(' ')
}

// Calcule la position du robot en pourcentage
const robotStyle = computed(() => {
  if (!level.value) return {}
  
  const cellSize = 100 / level.value.gridSize
  const x = store.robot.x * cellSize + cellSize / 2
  const y = store.robot.y * cellSize + cellSize / 2
  
  // Rotation selon la direction
  const rotationMap = {
    N: 0,
    E: 90,
    S: 180,
    W: 270
  }
  
  return {
    left: `${x}%`,
    top: `${y}%`,
    transform: `translate(-50%, -50%) rotate(${rotationMap[store.robot.dir]}deg)`,
    transition: 'all 0.3s ease-in-out'
  }
})

// Style de la grille
const gridStyle = computed(() => {
  if (!level.value) return {}
  return {
    gridTemplateColumns: `repeat(${level.value.gridSize}, 1fr)`,
    gridTemplateRows: `repeat(${level.value.gridSize}, 1fr)`
  }
})
</script>

<template>
  <div v-if="level" class="relative w-full aspect-square bg-cyber-950 rounded-xl overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] border-4 border-cyber-900">
    <!-- Grid Pattern Background -->
    <div class="absolute inset-0 pointer-events-none opacity-20">
      <div class="w-full h-full" style="background-image: linear-gradient(var(--ui-color-cyan-500) 1px, transparent 1px), linear-gradient(90deg, var(--ui-color-cyan-500) 1px, transparent 1px); background-size: 20px 20px;"></div>
    </div>

    <div class="grid w-full h-full relative z-10 p-2 gap-1" :style="gridStyle">
      <div
        v-for="(cell, index) in level.layout"
        :key="index"
        :class="[
          'aspect-square border-2 rounded-sm relative transition-all duration-300',
          cell === 0 && 'bg-black/40 border-cyber-900 opacity-20',
          cell === 1 && 'bg-cyber-900/40 border-cyber-800 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]',
          cell === 2 && 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(0,212,255,0.1)]',
          store.litGoals.some(goal => goal.x === (index % level.gridSize) && goal.y === Math.floor(index / level.gridSize)) && cell === 2 && 'bg-neon-green-500/40 border-neon-green-500 shadow-[0_0_20px_rgba(57,255,20,0.4)] scale-95'
        ]"
      >
        <!-- Goal marker visual -->
        <div 
          v-if="cell === 2"
          class="absolute inset-2 border-2 border-dashed rounded-md flex items-center justify-center"
          :class="[
            store.litGoals.some(goal => goal.x === (index % level.gridSize) && goal.y === Math.floor(index / level.gridSize))
              ? 'border-neon-green-500 animate-pulse opacity-100'
              : 'border-cyan-400/30 opacity-40'
          ]"
        >
          <UIcon 
            v-if="store.litGoals.some(goal => goal.x === (index % level.gridSize) && goal.y === Math.floor(index / level.gridSize))" 
            name="i-ph-check-bold" 
            class="text-neon-green-500 w-1/2 h-1/2" 
          />
          <UIcon 
            v-else 
            name="i-ph-lightning-fill" 
            class="text-cyan-400 w-1/2 h-1/2 animate-pulse" 
          />
        </div>
      </div>
      
      <!-- Robot -->
      <div class="absolute w-3/5 h-3/5 z-20 pointer-events-none drop-shadow-[0_0_15px_var(--ui-primary)]" :style="robotStyle">
        <div class="relative w-full h-full flex items-center justify-center">
          <div class="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
          <UIcon name="i-ph-robot-fill" class="w-full h-full text-white" />
        </div>
      </div>
    </div>
  </div>
</template>

