<template>
  <div class="logo-container group">
    <UIcon name="i-ph-robot-fill" class="logo-icon glow-cyan" />
    <span class="logo-text">LogicBot</span>
  </div>
</template>

<style scoped>
.logo-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  font-size: 1.25rem;
}

.logo-icon {
  width: 32px;
  height: 32px;
  color: var(--ui-primary);
  filter: drop-shadow(0 0 5px var(--ui-primary));
}

.logo-text {
  background: linear-gradient(135deg, var(--ui-primary), var(--ui-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;
  letter-spacing: -1px;
  text-transform: uppercase;
  font-family: var(--font-sans);
}
</style>
