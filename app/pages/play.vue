<script setup lang="ts">
const store = useGameStore()
const route = useRoute()

// Charge le niveau au montage
onMounted(() => {
  const levelId = route.query.level ? Number(route.query.level) : 1
  store.loadLevel(levelId)
})

useHead({
  title: `Niveau ${store.currentLevelId} - LogicBot`
})
</script>

<template>
  <div class="game-page h-screen w-screen bg-[#050505] flex flex-col overflow-hidden select-none">
    <!-- Animated Background (consistent with landing) -->
    <div class="fixed inset-0 pointer-events-none z-0 opacity-20">
      <div class="absolute inset-0 bg-[url('/background_neon_circuit.webp')] bg-cover bg-center mix-blend-screen"></div>
    </div>

    <!-- Compact Top Bar -->
    <div
      class="relative z-20 h-12 flex items-center justify-between px-4 bg-cyber-950/90 backdrop-blur-md border-b border-cyber-800/50">
      <div class="flex items-center gap-3">
        <NuxtLink to="/"
          class="group flex items-center gap-1 text-cyber-400 hover:text-primary transition-colors font-black uppercase tracking-widest text-xs">
          <UIcon name="i-ph-caret-left-bold" class="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
          <span>QUITTER</span>
        </NuxtLink>
      </div>

      <div class="flex items-center gap-2">
        <UIcon name="i-ph-robot-fill" class="text-primary w-5 h-5 glow-cyan animate-pulse" />
        <h1 class="text-lg font-black tracking-[0.15em] text-white uppercase italic">
          NIVEAU <span class="text-magenta-500">{{ store.currentLevelId }}</span>
        </h1>
      </div>

      <UButton icon="i-ph-arrow-clockwise-bold" variant="ghost" color="neutral" size="xs" @click="store.reset()"
        class="font-black uppercase tracking-widest text-xs hover:text-magenta-500">
        RESET
      </UButton>
    </div>

    <!-- Main Game Layout - Full Screen -->
    <main class="relative z-10 flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
      <!-- Left: Viewport Area (The 3D Grid) -->
      <section class="flex-[1.2] flex items-center justify-center p-4 lg:p-8 min-h-0">
        <div class="w-full h-full max-w-[700px] aspect-square relative group">
          <!-- Ambient Glow around the grid -->
          <div
            class="absolute -inset-4 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
          </div>

          <div
            class="w-full h-full border-2 border-neon-cyan rounded-3xl bg-cyber-900/40 backdrop-blur-sm p-4 shadow-[0_0_50px_rgba(0,212,255,0.15)] flex items-center justify-center relative z-10 overflow-hidden">
            <!-- Corner decorations -->
            <div class="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-lg"></div>
            <div class="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/40 rounded-tr-lg"></div>
            <div class="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary/40 rounded-bl-lg"></div>
            <div class="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br-lg"></div>

            <GameViewport />
          </div>
        </div>
      </section>

      <!-- Right: Control Center -->
      <aside class="flex-1 flex flex-col border-l border-cyber-800 bg-cyber-950/40 backdrop-blur-md min-h-0">
        <!-- Scrollable content area -->
        <div class="flex-1 flex flex-col min-h-0 p-4 gap-4 overflow-y-auto custom-scrollbar">
          <!-- Level Description Card -->
          <GameControls />

          <!-- Editor Zone -->
          <div
            class="flex-1 flex flex-col min-h-[400px] lg:min-h-0 border-2 border-neon-magenta rounded-2xl bg-cyber-900/60 p-4 shadow-[0_0_30px_rgba(255,0,157,0.1)]">
            <GameEditor />
          </div>
        </div>
      </aside>
    </main>
  </div>
</template>

<style>
/* Global scrollbar for the game */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(26, 26, 46, 0.5);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 212, 255, 0.2);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 212, 255, 0.4);
}
</style>
