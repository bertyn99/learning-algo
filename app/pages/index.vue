<script setup lang="ts">
useHead({
  title: 'LogicBot - Maîtrisez la logique du code'
})

useSeoMeta({
  title: 'LogicBot - Maîtrisez la logique du code',
  description: 'Un jeu éducatif pour apprendre la programmation visuelle. Guidez un robot à travers des labyrinthes 3D !',
  ogTitle: 'LogicBot - Maîtrisez la logique du code',
  ogDescription: 'Un jeu éducatif pour apprendre la programmation visuelle. Guidez un robot à travers des labyrinthes 3D !'
})
</script>

<template>
  <div
    class="landing-page min-h-screen bg-[#050505] text-cyber-100 overflow-x-hidden relative selection:bg-primary selection:text-black">
    <!-- Animated Background Circuits -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div
        class="absolute inset-0 bg-[url('/background_neon_circuit.webp')] opacity-40 bg-cover bg-center mix-blend-screen animate-pulse-slow">
      </div>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]"></div>
      <!-- Energy pulses -->
      <div
        class="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent animate-pulse-flow">
      </div>
      <div
        class="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-magenta-500/20 to-transparent animate-pulse-flow-delayed">
      </div>
    </div>

    <div class="relative z-10">
      <!-- Hero Section -->
      <section class="relative pt-24 pb-20 px-4 flex flex-col items-center text-center">
        <h1
          class="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase mb-16 max-w-6xl leading-[1.05]">
          <span class="text-neon-cyan block mb-2">MAÎTRISEZ LA LOGIQUE DU CODE,</span>
          <span class="text-neon-magenta block">UNE TUILE À LA FOIS.</span>
        </h1>

        <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-4">
          <div class="text-left space-y-8 lg:pr-12">
            <h2
              class="text-4xl font-black text-white tracking-widest flex items-center gap-4 italic border-l-4 border-primary pl-6 py-2">
              INTRODUCTION
            </h2>
            <p class="text-xl md:text-2xl text-cyber-200 leading-relaxed font-medium">
              Découvrez <span class="text-primary font-bold">LogicBot</span>, le petit robot avec une grande mission.
              Votre objectif ? Le guider à travers des labyrinthes 3D complexes pour éclairer la grille.
            </p>
            <p
              class="text-xl md:text-2xl text-cyber-200 leading-relaxed font-medium italic border-l-2 border-cyber-800 pl-6">
              Mais il y a un piège : vous ne pouvez pas le contrôler directement avec une manette. <span
                class="text-secondary font-bold">Vous devez le programmer !</span>
            </p>
          </div>

          <!-- Isometric Robot Illustration -->
          <div class="relative flex justify-center perspective-1000 py-12">
            <div class="relative transform rotate-x-45 rotate-z--45 scale-110">
              <!-- Grid Platform -->
              <div
                class="grid grid-cols-4 gap-2 p-2 bg-cyber-900/40 rounded-lg border border-primary/30 shadow-[0_0_50px_rgba(0,212,255,0.2)]">
                <div v-for="i in 16" :key="i"
                  class="w-16 h-16 md:w-20 md:h-20 rounded shadow-inner transition-colors duration-500" :class="[
                    i % 5 === 0 ? 'bg-primary/40 shadow-[0_0_15px_rgba(0,212,255,0.6)]' :
                      i % 3 === 0 ? 'bg-secondary/30 shadow-[0_0_15px_rgba(255,0,157,0.4)]' :
                        i % 7 === 0 ? 'bg-green-500/30 shadow-[0_0_15px_rgba(57,255,20,0.4)]' :
                          'bg-cyber-950/80 border border-cyber-800'
                  ]"></div>
              </div>

              <!-- Robot floating above -->
              <div class="absolute inset-0 flex items-center justify-center -translate-z-20 pointer-events-none">
                <div class="relative -translate-y-16 animate-float">
                  <UIcon name="i-ph-robot-fill"
                    class="w-40 h-40 md:w-48 md:h-48 text-primary filter drop-shadow-[0_0_20px_rgba(0,212,255,0.9)]" />
                  <!-- Holographic panel -->
                  <div
                    class="absolute -right-8 -top-8 w-24 h-16 bg-cyan-500/20 backdrop-blur-md border border-cyan-400/50 rounded flex flex-col p-2 gap-1 rotate-z-12 animate-pulse">
                    <div class="h-1 w-full bg-cyan-400/50 rounded"></div>
                    <div class="h-1 w-2/3 bg-cyan-400/50 rounded"></div>
                    <div class="h-1 w-3/4 bg-cyan-400/50 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Glow under platform -->
            <div class="absolute bottom-12 w-64 h-32 bg-primary/20 blur-[100px] rounded-full"></div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="py-32 px-4 relative">
        <div class="max-w-6xl mx-auto">
          <h2
            class="text-4xl md:text-5xl font-black text-center text-neon-cyan mb-24 tracking-[0.2em] uppercase italic">
            COMMENT ÇA MARCHE
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            <!-- Step 1 -->
            <div class="flex flex-col items-center text-center space-y-10 group">
              <div class="relative">
                <div
                  class="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 group-hover:bg-primary/40 transition-colors">
                </div>
                <div
                  class="w-32 h-32 flex items-center justify-center rounded-full border-2 border-primary glow-box-cyan bg-black relative z-10 transition-transform group-hover:scale-110">
                  <UIcon name="i-ph-magnifying-glass-plus-duotone" class="w-16 h-16 text-primary" />
                </div>
              </div>
              <div class="space-y-4">
                <h3
                  class="text-2xl font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors italic">
                  ANALYSEZ LE PUZZLE
                </h3>
                <p class="text-cyber-300 font-medium leading-relaxed text-lg max-w-[280px]">
                  Observez la grille et trouvez le chemin vers les tuiles bleues.
                </p>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="flex flex-col items-center text-center space-y-10 group">
              <div class="relative">
                <div
                  class="absolute inset-0 bg-secondary/20 blur-2xl rounded-full scale-150 group-hover:bg-secondary/40 transition-colors">
                </div>
                <div
                  class="w-32 h-32 flex items-center justify-center rounded-full border-2 border-secondary glow-box-magenta bg-black relative z-10 transition-transform group-hover:scale-110">
                  <UIcon name="i-ph-code-block-duotone" class="w-16 h-16 text-secondary" />
                </div>
              </div>
              <div class="space-y-4">
                <h3
                  class="text-2xl font-black uppercase tracking-widest text-white group-hover:text-secondary transition-colors italic">
                  CONSTRUISEZ VOTRE CODE
                </h3>
                <p class="text-cyber-300 font-medium leading-relaxed text-lg max-w-[280px]">
                  Glissez-déposez des commandes comme « Marcher », « Sauter » et « Éclairer ».
                </p>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="flex flex-col items-center text-center space-y-10 group">
              <div class="relative">
                <div
                  class="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 group-hover:bg-primary/40 transition-colors">
                </div>
                <div
                  class="w-32 h-32 flex items-center justify-center rounded-full border-2 border-primary glow-box-cyan bg-black relative z-10 transition-transform group-hover:scale-110">
                  <UIcon name="i-ph-timer-duotone" class="w-16 h-16 text-primary" />
                </div>
              </div>
              <div class="space-y-4">
                <h3
                  class="text-2xl font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors italic">
                  LANCEZ LA SIMULATION
                </h3>
                <p class="text-cyber-300 font-medium leading-relaxed text-lg max-w-[280px]">
                  Appuyez sur Lecture et regardez votre robot exécuter vos instructions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Visual / Devices Section -->
      <section class="py-32 px-4 relative flex items-center justify-center overflow-hidden">
        <div class="max-w-6xl w-full relative h-[500px] flex items-center justify-center">
          <!-- Main Laptop -->
          <div class="absolute z-20 w-full max-w-4xl transform -translate-x-8 group">
            <div
              class="border-[6px] border-[#222] rounded-t-3xl overflow-hidden shadow-2xl bg-black aspect-[16/9] relative glow-box-cyan">
              <div class="absolute inset-0 bg-[#0d0d17]">
                <!-- Simulated Game UI -->
                <div class="w-full h-full p-8 flex gap-6">
                  <div class="flex-1 border-2 border-cyan-500/20 rounded-xl bg-cyan-500/5 relative overflow-hidden">
                    <div class="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-20">
                      <div v-for="i in 100" :key="i" class="border-[0.5px] border-cyan-500/30"></div>
                    </div>
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <UIcon name="i-ph-robot" class="w-24 h-24 text-primary animate-pulse" />
                    </div>
                  </div>
                  <div class="w-1/3 space-y-4">
                    <div class="h-10 border border-secondary/40 rounded-lg bg-secondary/10 px-4 flex items-center">
                      <div class="w-3 h-3 rounded-full bg-secondary animate-pulse mr-3"></div>
                      <span class="text-[10px] text-secondary font-mono uppercase tracking-tighter">NIVEAU 3: LA
                        BOUCLE</span>
                    </div>
                    <div class="flex-1 border border-cyber-700 rounded-lg bg-cyber-800/50 p-4">
                      <div class="space-y-2">
                        <div v-for="i in 5" :key="i"
                          class="h-6 border border-cyber-600 rounded bg-cyber-900 flex items-center px-3 gap-2">
                          <div class="w-2 h-2 rounded-sm bg-primary/50"></div>
                          <div class="h-1 w-12 bg-cyber-700 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="h-5 bg-[#1a1a1a] rounded-b-2xl w-[104%] -ml-[2%] shadow-2xl border-t border-white/5"></div>
            <div class="h-2 w-32 bg-[#111] mx-auto rounded-b-xl mt-[-1px]"></div>
          </div>

          <!-- Secondary Laptop/Tablet -->
          <div
            class="absolute z-10 w-full max-w-3xl transform translate-x-32 translate-y-12 opacity-80 blur-[2px] hover:blur-none hover:opacity-100 transition-all duration-700">
            <div
              class="border-[6px] border-[#1a1a1a] rounded-t-3xl overflow-hidden shadow-2xl bg-black aspect-[16/9] relative glow-box-magenta">
              <div class="absolute inset-0 bg-[#0d0d17] flex items-center justify-center">
                <UIcon name="i-ph-game-controller-duotone" class="w-32 h-32 text-secondary opacity-30" />
              </div>
            </div>
            <div class="h-5 bg-[#1a1a1a] rounded-b-2xl w-[104%] -ml-[2%] shadow-2xl"></div>
          </div>
        </div>
      </section>

      <!-- Why Play Section -->
      <section class="py-40 px-4 relative flex flex-col items-center overflow-hidden">
        <div class="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <h2 class="text-4xl md:text-5xl font-black text-neon-cyan tracking-[0.2em] uppercase italic">
            POURQUOI JOUER ?
          </h2>
          <p class="text-2xl md:text-3xl text-cyber-200 font-bold leading-relaxed px-4">
            LogicBot transforme les concepts complexes de l'informatique — comme les algorithmes, les boucles et les
            procédures — en un jeu de puzzle amusant et addictif.
          </p>
          <p class="text-2xl md:text-3xl text-cyber-100 font-black tracking-tight italic">
            Que vous ayez 7 ou 77 ans, vous penserez comme un programmeur en un rien de temps.
          </p>

          <div class="pt-24 relative group">
            <div
              class="absolute inset-0 bg-primary/20 blur-[60px] rounded-full scale-125 group-hover:bg-primary/40 transition-colors">
            </div>
            <!-- Massive Play Button -->
            <NuxtLink to="/play"
              class="relative z-10 inline-flex items-center justify-center px-16 py-8 border-2 border-primary rounded-2xl bg-black transition-all duration-300 hover:scale-110 active:scale-95 group/btn overflow-hidden">
              <!-- Inner glow borders -->
              <div
                class="absolute inset-1 border border-primary/50 rounded-xl opacity-50 group-hover/btn:opacity-100 transition-opacity">
              </div>
              <div class="absolute inset-0 bg-primary opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>

              <span
                class="text-4xl md:text-5xl font-black text-white tracking-[0.1em] uppercase drop-shadow-[0_0_15px_rgba(0,212,255,1)]">
                JOUER !
              </span>

              <!-- Pulsing magenta shadow below -->
              <div
                class="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-10 bg-secondary/40 blur-[40px] rounded-full animate-pulse-slow">
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Decorative particles -->
        <div
          class="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none">
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.landing-page {
  font-family: 'Public Sans', sans-serif;
}

h1,
h2,
h3,
.font-mono {
  font-family: 'JetBrains Mono', monospace;
}

.perspective-1000 {
  perspective: 1000px;
}

.rotate-x-45 {
  transform: rotateX(45deg);
}

.rotate-z--45 {
  transform: rotateZ(-45deg);
}

.rotate-z-12 {
  transform: rotateZ(12deg);
}

.-translate-z-20 {
  transform: translateZ(-20px);
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

@keyframes pulse-flow {
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateY(100%);
  }
}

.animate-pulse-flow {
  animation: pulse-flow 8s linear infinite;
}

.animate-pulse-flow-delayed {
  animation: pulse-flow 10s linear infinite 4s;
}

.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Specific text stroke for outline effects if needed */
.text-outline-primary {
  -webkit-text-stroke: 1px var(--ui-color-cyan-500);
}
</style>
