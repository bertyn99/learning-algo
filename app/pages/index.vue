<script setup lang="ts">
useHead({
  title: 'LogicBot - Apprends à programmer en t\'amusant !'
})

useSeoMeta({
  title: 'LogicBot - Apprends à programmer en t\'amusant !',
  description: 'Un jeu éducatif pour apprendre la programmation visuelle. Glisse et dépose des blocs pour contrôler un robot et résoudre des défis !',
  ogTitle: 'LogicBot - Apprends à programmer en t\'amusant !',
  ogDescription: 'Un jeu éducatif pour apprendre la programmation visuelle. Glisse et dépose des blocs pour contrôler un robot et résoudre des défis !'
})
</script>

<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <UPageHero
      title="Bienvenue dans LogicBot ! 🤖"
      description="Apprends à programmer en t'amusant ! Glisse et dépose des blocs pour contrôler un robot et résous des défis passionnants."
      class="border-b border-cyber-900 bg-transparent"
      :links="[{
        label: 'Commencer à jouer',
        to: '/play',
        trailingIcon: 'i-ph-arrow-right-bold',
        size: 'xl',
        color: 'primary',
        class: 'glow-cyan font-bold'
      }]"
    >
      <template #headline>
        <div class="flex justify-center mb-4 relative">
          <div class="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full"></div>
          <UIcon name="i-ph-robot-fill" class="w-40 h-40 text-primary glow-cyan animate-pulse relative z-10" />
        </div>
      </template>
    </UPageHero>

    <!-- Comment jouer -->
    <UPageSection
      id="how-to-play"
      title="Comment jouer ?"
      description="C'est simple comme bonjour ! Suis ces 3 étapes pour devenir un maître programmeur."
      class="bg-transparent"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div class="group">
          <UCard class="border-neon-cyan bg-cyber-900 transition-all duration-300 hover:scale-105">
            <template #body>
              <div class="flex flex-col items-center text-center gap-4">
                <div class="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-magenta-500 flex items-center justify-center text-white font-black text-xl shadow-[0_0_15px_rgba(0,212,255,0.5)]">
                  1
                </div>
                <UIcon name="i-ph-hand-grabbing-fill" class="w-20 h-20 text-primary drop-shadow-[0_0_8px_var(--ui-primary)]" />
                <h3 class="text-2xl font-black text-cyan-400">Glisse des blocs</h3>
                <p class="text-base text-cyber-300 leading-relaxed font-medium">
                  Choisis parmi les blocs disponibles et glisse-les dans la zone "Programme Principal".
                </p>
              </div>
            </template>
          </UCard>
        </div>

        <div class="group">
          <UCard class="border-neon-magenta bg-cyber-900 transition-all duration-300 hover:scale-105">
            <template #body>
              <div class="flex flex-col items-center text-center gap-4">
                <div class="w-14 h-14 rounded-full bg-gradient-to-br from-magenta-500 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-[0_0_15px_rgba(255,0,157,0.5)]">
                  2
                </div>
                <UIcon name="i-ph-play-fill" class="w-20 h-20 text-secondary drop-shadow-[0_0_8px_var(--ui-secondary)]" />
                <h3 class="text-2xl font-black text-magenta-400">Lance le programme</h3>
                <p class="text-base text-cyber-300 leading-relaxed font-medium">
                  Clique sur "Jouer" pour voir ton robot exécuter tes commandes et se déplacer sur la grille.
                </p>
              </div>
            </template>
          </UCard>
        </div>

        <div class="group">
          <UCard class="border-neon-cyan bg-cyber-900 transition-all duration-300 hover:scale-105">
            <template #body>
              <div class="flex flex-col items-center text-center gap-4">
                <div class="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-magenta-500 flex items-center justify-center text-white font-black text-xl shadow-[0_0_15px_rgba(0,212,255,0.5)]">
                  3
                </div>
                <UIcon name="i-ph-lightbulb-fill" class="w-20 h-20 text-primary drop-shadow-[0_0_8px_var(--ui-primary)]" />
                <h3 class="text-2xl font-black text-cyan-400">Allume les lumières</h3>
                <p class="text-base text-cyber-300 leading-relaxed font-medium">
                  Utilise le bloc "Allumer" pour éclairer toutes les cases bleues et gagner le niveau !
                </p>
              </div>
            </template>
          </UCard>
        </div>
      </div>
    </UPageSection>

    <!-- Compétences développées -->
    <UPageSection
      id="skills"
      title="Ce que tu vas apprendre"
      description="En jouant à LogicBot, tu développes des compétences essentielles pour devenir un super programmeur !"
      class="bg-transparent border-y border-cyber-900"
      :features="[{
        icon: 'i-ph-brain-fill',
        title: 'Pensée logique',
        description: 'Apprends à réfléchir étape par étape et à résoudre des problèmes de manière structurée.',
        class: 'text-cyan-400'
      }, {
        icon: 'i-ph-list-numbers-fill',
        title: 'Séquençage',
        description: 'Comprends l\'importance de l\'ordre des instructions dans un programme.',
        class: 'text-magenta-400'
      }, {
        icon: 'i-ph-puzzle-piece-fill',
        title: 'Résolution de problèmes',
        description: 'Développe ta capacité à analyser une situation et trouver la meilleure solution.',
        class: 'text-cyan-400'
      }, {
        icon: 'i-ph-repeat-fill',
        title: 'Itération et amélioration',
        description: 'Apprends à tester, corriger et améliorer tes programmes jusqu\'à ce qu\'ils fonctionnent parfaitement.',
        class: 'text-magenta-400'
      }, {
        icon: 'i-ph-lightbulb-fill',
        title: 'Créativité',
        description: 'Il y a souvent plusieurs façons de résoudre un problème. Trouve la tienne !',
        class: 'text-cyan-400'
      }, {
        icon: 'i-ph-code-fill',
        title: 'Bases de la programmation',
        description: 'Découvre les concepts fondamentaux comme les boucles, les conditions et les fonctions.',
        class: 'text-magenta-400'
      }]"
    />

    <!-- CTA Final -->
    <UPageSection class="bg-transparent">
      <UPageCTA
        title="Prêt à devenir un maître programmeur ?"
        description="Rejoins LogicBot et commence ton aventure dans le monde de la programmation !"
        variant="subtle"
        class="border-neon-cyan bg-cyber-900/40 backdrop-blur-sm overflow-hidden"
        :links="[{
          label: 'Commencer maintenant',
          to: '/play',
          trailingIcon: 'i-ph-arrow-right-bold',
          size: 'xl',
          color: 'primary',
          class: 'glow-cyan font-bold'
        }]"
      >
        <template #background>
          <div class="absolute inset-0 opacity-10 pointer-events-none">
            <div class="grid grid-cols-10 gap-1 h-full">
              <div v-for="i in 100" :key="i" class="aspect-square border border-cyan-500/20"></div>
            </div>
          </div>
        </template>
      </UPageCTA>
    </UPageSection>
  </div>
</template>

