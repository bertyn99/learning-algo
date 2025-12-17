<script setup lang="ts">
const store = useGameStore()
const route = useRoute()

// Charge le niveau au montage
onMounted(() => {
  const levelId = route.query.level ? Number(route.query.level) : 1
  store.loadLevel(levelId)
})

// Watch pour les modales
const showWinModal = computed(() => store.status === 'WIN')
const showFailModal = computed(() => store.status === 'FAIL')

// Reset modal state when status changes
watch([showWinModal, showFailModal], () => {
  // Les modales sont gérées par le computed, pas besoin de logique supplémentaire
})
</script>

<template>
  <UContainer class="max-w-7xl">
    <div class="flex flex-col gap-6 min-h-[calc(100vh-200px)] py-6">
      <!-- Header avec niveau et reset -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 bg-cyber-900 border-2 border-neon-magenta rounded-xl shadow-[0_0_15px_rgba(255,0,157,0.3)]">
        <NuxtLink 
          to="/" 
          class="inline-flex items-center gap-2 text-cyber-300 font-bold no-underline transition-all hover:text-primary hover:drop-shadow-[0_0_5px_var(--ui-primary)] order-3 sm:order-1 font-mono"
        >
          <UIcon name="i-ph-caret-left-bold" />
          <span>QUITTER</span>
        </NuxtLink>
        <div class="flex items-center gap-3 order-1 sm:order-2 sm:flex-grow justify-center">
          <UIcon name="i-ph-robot-fill" class="text-primary w-8 h-8 glow-cyan" />
          <h1 class="text-3xl font-black tracking-tighter text-white uppercase italic">
            Niveau <span class="text-magenta-500">{{ route.query.level || 1 }}</span>
          </h1>
        </div>
        <UButton
          icon="i-ph-arrow-clockwise-bold"
          color="neutral"
          variant="ghost"
          @click="store.reset()"
          class="order-2 sm:order-3 font-bold hover:text-magenta-400"
        >
          RESET
        </UButton>
      </div>

      <!-- Layout principal -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        <!-- Zone gauche : Viewport -->
        <div class="lg:col-span-7 flex items-start justify-center">
          <div class="w-full h-full border-2 border-neon-cyan rounded-2xl bg-cyber-900/80 p-4 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
            <GameViewport />
          </div>
        </div>

        <!-- Zone droite : Éditeur et Contrôles -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <GameControls />
          <div class="flex-1 border-2 border-neon-magenta rounded-2xl bg-cyber-900/80 p-4 shadow-[0_0_20px_rgba(255,0,157,0.2)]">
            <GameEditor />
          </div>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <GameModal v-model="showWinModal" type="win" />
    <GameModal v-model="showFailModal" type="fail" />
  </UContainer>
</template>

