<script setup lang="ts">
import type { CellType } from '~/types/game'

const store = useGameStore()

const level = computed(() => store.currentLevel)

// Check if a cell is a goal
const isGoalCell = (index: number): boolean => {
  if (!level.value) return false
  const x = index % level.value.gridSize
  const y = Math.floor(index / level.value.gridSize)
  const isGoal = level.value.goals.some(goal => goal.x === x && goal.y === y)
  if (isGoal) {
    console.log(`🎯 Goal cell found at index ${index}, x: ${x}, y: ${y}`)
  }
  return isGoal
}

// Check if a goal is lit
const isGoalLit = (index: number): boolean => {
  if (!level.value) return false
  const x = index % level.value.gridSize
  const y = Math.floor(index / level.value.gridSize)
  return store.litGoals.some(goal => goal.x === x && goal.y === y)
}

// Calcule la position du robot en pourcentage
const robotStyle = computed(() => {
  if (!level.value) return {}

  const cellSize = 100 / level.value.gridSize
  const x = store.robot.x * cellSize
  const y = store.robot.y * cellSize

  // Rotation selon la direction
  const rotationMap = {
    N: 0,
    E: 90,
    S: 180,
    W: 270
  }

  return {
    width: `${cellSize}%`,
    height: `${cellSize}%`,
    left: `${x}%`,
    top: `${y}%`,
    transform: `rotate(${rotationMap[store.robot.dir]}deg)`,
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
  <div v-if="level"
    class="relative w-full aspect-square bg-cyber-950/20 rounded-xl overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] border border-cyber-800">
    <!-- Isometric Grid Simulation -->
    <div class="absolute inset-0 pointer-events-none z-0 opacity-10">
      <div class="w-full h-full"
        style="background-image: linear-gradient(rgba(0,212,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.2) 1px, transparent 1px); background-size: 5% 5%;">
      </div>
    </div>

    <!-- The actual grid container -->
    <div class="grid w-full h-full relative z-10 p-1 gap-1" :style="gridStyle">
      <div v-if="level" v-for="(cell, index) in level.layout" :key="index"
        class="aspect-square border-4 rounded-md relative transition-all duration-500" :class="[
          cell === 0 && 'bg-transparent border-transparent opacity-0',
          cell === 1 && !isGoalCell(index) && 'bg-cyber-900/60 border-cyber-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]',
          isGoalCell(index) && !isGoalLit(index) && 'bg-yellow-400/90 border-yellow-300 border-4 shadow-[0_0_60px_rgba(255,215,0,1),inset_0_0_30px_rgba(255,215,0,0.5)] animate-pulse-goal',
          isGoalCell(index) && isGoalLit(index) && 'bg-cyan-300/90 border-cyan-100 border-4 shadow-[0_0_80px_rgba(0,255,255,1),inset_0_0_40px_rgba(0,255,255,0.6)] scale-95 animate-pulse-goal-active'
        ]">
        <!-- GOAL CELL - BRIGHT YELLOW TARGET -->
        <div v-if="isGoalCell(index)" class="absolute inset-0 flex items-center justify-center overflow-hidden">
          <!-- Bright glowing background -->
          <div class="absolute inset-0 bg-linear-to-br from-yellow-300/50 to-yellow-500/50"></div>

          <!-- Animated rotating ring -->
          <div class="absolute inset-3 border-4 border-yellow-200 rounded-full animate-spin-slow opacity-70"></div>

          <!-- Star burst lines -->
          <div class="absolute w-full h-px bg-yellow-200"></div>
          <div class="absolute h-full w-px bg-yellow-200"></div>
          <div class="absolute w-full h-px bg-yellow-200 rotate-45 origin-center"></div>
          <div class="absolute w-full h-px bg-yellow-200 -rotate-45 origin-center"></div>

          <!-- Center icon -->
          <div class="relative z-10 flex items-center justify-center">
            <div class="text-4xl animate-bounce" :class="isGoalLit(index) ? 'opacity-100' : 'opacity-90'">
              {{ isGoalLit(index) ? '✅' : '🎯' }}
            </div>
          </div>

          <!-- GOAL Label -->
          <div
            class="absolute bottom-1 left-1/2 -translate-x-1/2 text-[11px] font-black uppercase tracking-wider whitespace-nowrap bg-yellow-900 text-yellow-100 px-2 py-0.5 rounded-full">
            {{ isGoalLit(index) ? 'COMPLETED!' : 'GOAL' }}
          </div>
        </div>
      </div>

      <!-- Robot -->
      <div class="absolute z-20 pointer-events-none flex items-center justify-center p-[2px]" :style="robotStyle">
        <div class="relative w-full h-full flex items-center justify-center">
          <!-- Directional indicator -->
          <div
            class="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary blur-[2px] rounded-full animate-pulse">
          </div>

          <div class="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-slow"></div>
          <UIcon name="i-ph-robot-fill" class="w-[85%] h-[85%] text-white drop-shadow-[0_0_10px_rgba(0,212,255,1)]" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse-slow {

  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }

  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

@keyframes pulse-goal {

  0%,
  100% {
    box-shadow: 0 0 50px rgba(0, 212, 255, 0.9), inset 0 0 20px rgba(0, 212, 255, 0.3);
  }

  50% {
    box-shadow: 0 0 80px rgba(0, 212, 255, 1), inset 0 0 30px rgba(0, 212, 255, 0.5);
  }
}

@keyframes pulse-goal-active {

  0%,
  100% {
    box-shadow: 0 0 80px rgba(0, 212, 255, 1), inset 0 0 30px rgba(0, 212, 255, 0.5);
  }

  50% {
    box-shadow: 0 0 100px rgba(0, 212, 255, 1), inset 0 0 40px rgba(0, 212, 255, 0.8);
  }
}

@keyframes pulse-ring {

  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }

  50% {
    opacity: 0.9;
    transform: scale(1.05);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

.animate-pulse-goal {
  animation: pulse-goal 1.5s ease-in-out infinite;
}

.animate-pulse-goal-active {
  animation: pulse-goal-active 1s ease-in-out infinite;
}

.animate-pulse-ring {
  animation: pulse-ring 1.5s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
