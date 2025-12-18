<script setup lang="ts">
import { computed } from 'vue'
import type { Level, Robot, Position, Tile } from '~/types/game'
import { useGameStore } from '~/stores/game'

const props = defineProps<{
  level?: Level
  robot: Robot
  litGoals: Position[]
}>()

const store = useGameStore()
const level = computed(() => props.level)

// Constants for isometric rendering
const TILE_WIDTH = 64
const TILE_HEIGHT = 32
const HEIGHT_STEP = 16

const getIsoPos = (x: number, y: number, z: number = 0) => {
  const isoX = (x - y) * (TILE_WIDTH / 2)
  const isoY = (x + y) * (TILE_HEIGHT / 2) - (z * HEIGHT_STEP)
  return { isoX, isoY }
}

// Check if a cell is a goal
const isGoalCell = (x: number, y: number): boolean => {
  if (!level.value) return false
  return level.value.goals.some(goal => goal.x === x && goal.y === y)
}

// Check if a goal is lit
const isGoalLit = (x: number, y: number): boolean => {
  if (!level.value) return false
  return props.litGoals.some(goal => goal.x === x && goal.y === y)
}

// Get tile state from store
const getTileState = (tile: Tile) => {
  if (!tile.id) return true
  return store.interactiveState[tile.id] !== false
}

const sortedTiles = computed(() => {
  if (!level.value) return []
  // Sort by y, then x to ensure correct painter's order
  return [...level.value.layout].sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y
    return a.x - b.x
  })
})

const getTileStyle = (tile: Tile) => {
  const { isoX, isoY } = getIsoPos(tile.x, tile.y, tile.height)
  return {
    transform: `translate(${isoX}px, ${isoY}px)`,
    zIndex: tile.x + tile.y + (tile.height * 0.1)
  }
}

const robotStyle = computed(() => {
  if (!level.value) return {}
  
  // Find current tile to get height
  const currentTile = level.value.layout.find(t => t.x === props.robot.x && t.y === props.robot.y)
  const height = currentTile?.height || 0
  
  const { isoX, isoY } = getIsoPos(props.robot.x, props.robot.y, height)
  
  // Center robot on tile (add half width/height) and lift it slightly
  return {
    transform: `translate(${isoX + TILE_WIDTH / 2}px, ${isoY + TILE_HEIGHT / 2}px)`,
    zIndex: props.robot.x + props.robot.y + 0.5 + (height * 0.1),
    transition: 'all 0.3s ease-in-out'
  }
})

const robotRotationClass = computed(() => {
  switch (props.robot.dir) {
    case 'N': return 'robot-n'
    case 'E': return 'robot-e'
    case 'S': return 'robot-s'
    case 'W': return 'robot-w'
    default: return ''
  }
})

const actionClass = computed(() => {
  if (!store.activeAction) return ''
  return `action-${store.activeAction.toLowerCase()}`
})

const viewportStyle = computed(() => {
  if (!level.value) return {}
  // Center the grid in the viewport
  return {
    transform: 'translate(50%, 20%)'
  }
})
</script>

<template>
  <div
    v-if="level"
    class="relative w-full aspect-square bg-cyber-950/40 rounded-xl overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] border border-cyber-800"
  >
    <!-- Cyber Grid Background -->
    <div class="absolute inset-0 opacity-10 pointer-events-none cyber-grid-bg"></div>
    
    <!-- Scene container -->
    <div class="absolute inset-0 flex items-center justify-center overflow-auto custom-scrollbar">
      <div class="relative transition-transform duration-500" :style="viewportStyle">
        
        <!-- Tiles -->
        <div
          v-for="tile in sortedTiles"
          :key="`${tile.x}-${tile.y}`"
          class="absolute tile-container"
          :style="getTileStyle(tile)"
        >
          <!-- The 3D Block -->
          <div v-if="tile.type !== 'void'" class="relative block-3d" :class="[
            tile.color ? `color-${tile.color}` : '',
            tile.type === 'switch' ? 'type-switch' : '',
            tile.type === 'door' && !getTileState(tile) ? 'type-door-closed' : '',
            tile.type === 'door' && getTileState(tile) ? 'type-door-open' : '',
            tile.type === 'cracked' && !getTileState(tile) ? 'type-cracked-broken' : '',
            isGoalCell(tile.x, tile.y) ? 'is-goal' : '',
            isGoalLit(tile.x, tile.y) ? 'is-lit' : '',
            robot.x === tile.x && robot.y === tile.y ? 'is-active-tile' : ''
          ]">
            <!-- Top Face -->
            <div class="face top" :style="{ transform: `translateY(-${tile.height * HEIGHT_STEP}px)` }">
              <!-- Goal indicator on top face -->
              <div v-if="isGoalCell(tile.x, tile.y)" class="goal-indicator" :class="{ 'lit': isGoalLit(tile.x, tile.y) }">
                <div class="goal-ring"></div>
                <div class="goal-core"></div>
                <UIcon 
                  v-if="isGoalLit(tile.x, tile.y)" 
                  name="i-ph-check-bold" 
                  class="absolute text-white text-[10px] z-10" 
                />
              </div>
              
              <!-- Color indicator -->
              <div v-if="tile.color" class="absolute inset-x-4 inset-y-2 rounded-sm border-2 rotate-45" :style="{ borderColor: tile.color, backgroundColor: `${tile.color}44` }"></div>
              
              <!-- Switch indicator -->
              <div v-if="tile.type === 'switch'" class="absolute inset-0 flex items-center justify-center">
                <div class="w-4 h-4 bg-red-500 rounded-full shadow-[0_0_15px_red] animate-pulse"></div>
              </div>

              <!-- Cracked indicator -->
              <div v-if="tile.type === 'cracked'" class="absolute inset-0 flex items-center justify-center">
                <div class="w-full h-full opacity-40 overflow-hidden" style="clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)">
                  <div class="absolute inset-0 border-2 border-dashed border-red-900/50"></div>
                  <UIcon name="i-ph-warning-octagon-bold" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-red-500/30" />
                </div>
              </div>
            </div>
            
            <!-- Side Faces (only if height > 0) -->
            <div v-for="h in tile.height" :key="h" class="side-faces" :style="{ transform: `translateY(-${(h-1) * HEIGHT_STEP}px)` }">
               <div class="face left"></div>
               <div class="face right"></div>
            </div>
            
            <!-- Base Side Faces (always present if not void) -->
            <div class="face left"></div>
            <div class="face right"></div>
          </div>
        </div>

        <!-- Robot -->
        <div class="absolute z-20 pointer-events-none robot-container" :style="robotStyle">
          <div 
            class="relative w-16 h-16 -translate-x-1/2 -translate-y-[70%] flex items-center justify-center transition-all duration-300"
            :class="[actionClass]"
          >
             <!-- Robot shadow/base -->
             <div class="absolute bottom-4 w-8 h-4 bg-black/40 blur-sm rounded-full scale-x-[1.2] robot-shadow" />
             
             <!-- Robot glow -->
             <div class="absolute inset-0 bg-primary/10 blur-xl rounded-full animate-pulse-slow robot-glow-area" />
             
             <!-- Robot body -->
             <div class="relative robot-body animate-float" :class="robotRotationClass">
               <UIcon 
                 name="i-ph-robot-fill" 
                 class="w-12 h-12 text-white drop-shadow-[0_0_15px_rgba(0,212,255,0.8)]" 
               />
               <!-- Robot "eye" glow -->
               <div class="absolute top-[35%] left-[25%] w-[50%] h-[10%] bg-cyan-400 blur-[2px] opacity-80 rounded-full animate-pulse" />
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tile-container {
  width: 64px;
  height: 32px;
}

.block-3d {
  position: relative;
  width: 64px;
  height: 32px;
  transition: transform 0.3s ease;
}

.block-3d:hover {
  filter: brightness(1.2);
}

.face {
  position: absolute;
  width: 64px;
  height: 32px;
  transition: all 0.3s ease;
}

.face.top {
  background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
}

.face.left {
  background: #1e293b;
  width: 32px;
  height: 16px;
  top: 24px;
  left: 0;
  transform: skewY(26.5deg);
  border-left: 1px solid rgba(255, 255, 255, 0.05);
}

.face.right {
  background: #0f172a;
  width: 32px;
  height: 16px;
  top: 24px;
  left: 32px;
  transform: skewY(-26.5deg);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

/* Types styles */
.is-goal .face.top {
  background: linear-gradient(135deg, #422006 0%, #78350f 100%);
  border-color: rgba(251, 191, 36, 0.3);
}

.is-lit .face.top {
  background: linear-gradient(135deg, #083344 0%, #155e75 100%);
  border-color: rgba(34, 211, 238, 0.5);
  box-shadow: inset 0 0 15px rgba(34, 211, 238, 0.3), 0 0 20px rgba(34, 211, 238, 0.2);
}

.is-active-tile .face.top {
  border-color: rgba(0, 255, 255, 0.5);
  box-shadow: inset 0 0 10px rgba(0, 255, 255, 0.2);
}

.type-door-closed .face.top {
  background: linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%);
  border-color: rgba(239, 68, 68, 0.3);
}

.type-door-open .face.top {
  background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
  border-color: rgba(16, 185, 129, 0.3);
}

.type-cracked-broken .face.top {
  opacity: 0.1;
  transform: translateY(10px) rotateX(20deg) scale(0.8);
  filter: blur(2px) grayscale(1);
}

.type-cracked-broken .side-faces, 
.type-cracked-broken .face.left, 
.type-cracked-broken .face.right {
  opacity: 0.2;
}

.goal-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  display: flex;
  items-center: center;
  justify-content: center;
}

.goal-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid #fbbf24;
  border-radius: 50%;
  opacity: 0.6;
  transform: rotateX(60deg);
  animation: ring-pulse 2s infinite;
}

.goal-core {
  width: 8px;
  height: 8px;
  background: #fbbf24;
  border-radius: 50%;
  box-shadow: 0 0 10px #fbbf24;
}

.lit .goal-ring {
  border-color: #22d3ee;
  box-shadow: 0 0 10px #22d3ee;
}

.lit .goal-core {
  background: #22d3ee;
  box-shadow: 0 0 15px #22d3ee;
}

@keyframes ring-pulse {
  0% { transform: rotateX(60deg) scale(0.8); opacity: 0.8; }
  100% { transform: rotateX(60deg) scale(1.4); opacity: 0; }
}

/* Robot animations and directions */
.robot-body {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.robot-n { transform: rotateY(0deg); }
.robot-e { transform: rotateY(180deg); }
.robot-s { transform: rotateY(180deg) translateY(2px); }
.robot-w { transform: rotateY(0deg) translateY(2px); }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

/* Action Animations */
.action-jump {
  animation: robot-jump 0.5s cubic-bezier(0.45, 0.05, 0.55, 0.95);
}

.action-light .robot-glow-area {
  animation: robot-light-flash 0.5s ease-out;
  background-color: rgba(0, 255, 255, 0.4);
}

.action-turn_l, .action-turn_r {
  animation: robot-turn-bounce 0.4s ease-out;
}

@keyframes robot-jump {
  0%, 100% { transform: translate(-50%, -70%); }
  50% { transform: translate(-50%, -120%); }
}

@keyframes robot-light-flash {
  0% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(2.5); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.2; }
}

@keyframes robot-turn-bounce {
  0% { transform: translate(-50%, -70%) scale(1); }
  30% { transform: translate(-50%, -60%) scale(1.2, 0.8); }
  100% { transform: translate(-50%, -70%) scale(1); }
}

.cyber-grid-bg {
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(circle at 50% 50%, black, transparent 80%);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
