<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'fr'
  }
})

const title = 'LogicBot - Apprends à programmer en t\'amusant !'
const description = 'Un jeu éducatif pour apprendre la programmation visuelle. Glisse et dépose des blocs pour contrôler un robot et résoudre des défis !'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <UHeader class="border-b border-cyber-800 bg-cyber-950/80 backdrop-blur-md">
      <template #left>
        <NuxtLink to="/" class="logo-link group">
          <AppLogo class="transition-transform duration-300 group-hover:scale-105" />
        </NuxtLink>
      </template>

      <template #right>
        <UButton
          to="/play"
          icon="i-ph-play-fill"
          color="primary"
          variant="solid"
          class="glow-cyan font-bold"
        >
          Jouer
        </UButton>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain class="bg-transparent">
      <NuxtPage />
    </UMain>

    <USeparator icon="i-ph-robot" class="text-cyber-800" />

    <UFooter class="border-t border-cyber-800 bg-cyber-950/80 backdrop-blur-md">
      <template #left>
        <p class="text-sm text-cyber-400 font-mono">
          LogicBot • Apprends la programmation en t'amusant • © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UButton
          to="/play"
          icon="i-ph-play-bold"
          color="secondary"
          variant="ghost"
          class="hover:glow-magenta font-bold transition-all"
        >
          Jouer maintenant
        </UButton>
      </template>
    </UFooter>
  </UApp>
</template>

<style scoped>
.logo-link {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}
</style>
