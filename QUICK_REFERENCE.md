# 🎨 Tailwind CSS & Nuxt UI Quick Reference Card

## Tailwind Sizing Scale

| Size | Value | Usage |
|------|-------|-------|
| **px** | 1px | Borders |
| **0.5, 1** | 0.125rem, 0.25rem | Tiny spaces |
| **2, 3, 4** | 0.5rem, 0.75rem, 1rem | Small gaps |
| **6, 8** | 1.5rem, 2rem | Medium gaps |
| **12, 16** | 3rem, 4rem | Large spaces |

## Color Palette Quick Reference

```
Primary Colors
├── primary-500    → Main brand color
├── primary-100    → Light background
└── primary-900    → Dark background

Semantic Colors
├── success-500    → Green (positive)
├── warning-500    → Yellow (caution)
└── error-500      → Red (negative)

Gray Scale
├── gray-50        → Lightest (backgrounds)
├── gray-100       → Light backgrounds
├── gray-400       → Disabled text
└── gray-900       → Darkest (text)

Utility Colors
├── blue-*         → Information
├── violet-*       → Accent
├── yellow-*       → Warning/Highlight
└── orange-*       → Tertiary
```

## Responsive Breakpoints

```
Mobile First Pattern:
┌─────────────────────────────────────┐
│ No prefix (default: < 640px)        │ Mobile
├─────────────────────────────────────┤
│ sm: (640px - 767px)                 │ Small devices
├─────────────────────────────────────┤
│ md: (768px - 1023px)                │ Tablets
├─────────────────────────────────────┤
│ lg: (1024px - 1279px)               │ Laptops
├─────────────────────────────────────┤
│ xl: (1280px - 1535px)               │ Large desktops
├─────────────────────────────────────┤
│ 2xl: (1536px+)                      │ Very large desktops
└─────────────────────────────────────┘

Usage Examples:
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
                 ↑               ↑
          Tablet (2 cols)    Desktop (3 cols)
```

## Layout Patterns Cheat Sheet

### Flexbox Layouts
```vue
<!-- Row (default) -->
<div class="flex gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Column -->
<div class="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Centered content -->
<div class="flex items-center justify-center">
  Centered
</div>

<!-- Space between -->
<div class="flex justify-between items-center">
  <div>Left</div>
  <div>Right</div>
</div>
```

### Grid Layouts
```vue
<!-- 2-column grid -->
<div class="grid grid-cols-2 gap-4">
  <div>1</div>
  <div>2</div>
</div>

<!-- Responsive grid (1→2→3 columns) -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Card 1</div>
  <div>Card 2</div>
</div>

<!-- Auto-fit columns -->
<div class="grid auto-cols-max gap-4">
  <div>Auto sized</div>
</div>
```

## Common Component Patterns

### Button Patterns
```vue
<!-- Primary button -->
<UButton color="primary" size="lg">Click me</UButton>

<!-- Secondary outline button -->
<UButton color="gray" variant="outline">Cancel</UButton>

<!-- Icon button -->
<UButton icon="i-ph-check" variant="ghost">Check</UButton>

<!-- Loading button -->
<UButton :loading="isLoading">Save</UButton>

<!-- Disabled button -->
<UButton :disabled="!isValid">Submit</UButton>

<!-- Button group (responsive) -->
<div class="flex flex-col gap-2 sm:flex-row">
  <UButton class="flex-1">Option 1</UButton>
  <UButton class="flex-1">Option 2</UButton>
</div>
```

### Card Patterns
```vue
<!-- Simple card -->
<UCard>
  <p>Content</p>
</UCard>

<!-- Card with header/footer -->
<UCard>
  <template #header>
    <h3>Title</h3>
  </template>
  <p>Content</p>
  <template #footer>
    <button>Action</button>
  </template>
</UCard>

<!-- Hover card -->
<UCard class="transition-all hover:shadow-lg hover:-translate-y-1">
  <p>Hover me</p>
</UCard>
```

### Badge Patterns
```vue
<!-- Subtle badge (default) -->
<UBadge>Label</UBadge>

<!-- Colored badges -->
<UBadge color="red">Error</UBadge>
<UBadge color="green">Success</UBadge>
<UBadge color="yellow">Warning</UBadge>

<!-- Size variants -->
<UBadge size="sm">Small</UBadge>
<UBadge size="lg">Large</UBadge>

<!-- Dynamic color -->
<UBadge :color="isActive ? 'green' : 'gray'">
  {{ status }}
</UBadge>
```

## Text & Typography

```
Font Sizes:
text-xs      → 12px (smallest)
text-sm      → 14px
text-base    → 16px (default)
text-lg      → 18px
text-xl      → 20px
text-2xl     → 24px
text-3xl     → 30px (largest)

Font Weights:
font-light    → 300
font-normal   → 400 (default)
font-medium   → 500
font-semibold → 600
font-bold     → 700
font-extrabold → 800

Line Heights:
leading-none   → No line height
leading-tight  → Tight
leading-normal → Normal (default)
leading-relaxed → Relaxed (better readability)
```

## Spacing & Padding

```
Gap (flex/grid):        Padding:
gap-1   → 0.25rem       p-1    → 0.25rem
gap-2   → 0.5rem        p-2    → 0.5rem
gap-3   → 0.75rem       p-3    → 0.75rem
gap-4   → 1rem          p-4    → 1rem
gap-6   → 1.5rem        p-6    → 1.5rem
gap-8   → 2rem          p-8    → 2rem

Directional Padding:
px-4    → left & right (horizontal)
py-2    → top & bottom (vertical)
pt-4    → top only
pb-4    → bottom only
pl-4    → left only
pr-4    → right only
```

## Dark Mode Examples

```vue
<!-- Simple dark mode -->
<div class="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content
</div>

<!-- Text with contrast -->
<p class="text-gray-700 dark:text-gray-300">
  Better readability in both modes
</p>

<!-- Borders -->
<div class="border border-gray-200 dark:border-gray-700">
  Content
</div>

<!-- Gradient in dark mode -->
<div class="bg-gradient-to-r from-blue-100 to-purple-100 
            dark:from-blue-900 dark:to-purple-900">
  Gradient background
</div>
```

## State-Based Styling

```vue
<!-- Hover states -->
<div class="bg-gray-100 hover:bg-gray-200 transition-colors">
  Hover effect
</div>

<!-- Focus states (accessibility) -->
<input class="focus:outline-none focus:ring-2 focus:ring-blue-500">

<!-- Disabled state -->
<button :disabled="!isValid" class="disabled:opacity-50 disabled:cursor-not-allowed">
  Click me
</button>

<!-- Group hover (parent) -->
<div class="group border rounded hover:border-blue-500">
  <p class="text-gray-600 group-hover:text-blue-600">Changes on parent hover</p>
</div>
```

## Animations

```
Built-in Animations:
animate-spin          → Spinning loader
animate-bounce        → Bouncing effect
animate-pulse         → Pulsing effect

Duration:
duration-75          → 75ms
duration-100         → 100ms
duration-200         → 200ms (recommended)
duration-300         → 300ms (slower animations)

Timing Function:
ease-in              → Slow start
ease-out             → Slow end
ease-in-out          → Slow both ends
ease-linear          → Constant speed

Transition:
transition-all       → All properties
transition-colors    → Colors only
transition-opacity   → Opacity only

Example:
<div class="transition-all duration-300 hover:shadow-lg">
  Smooth hover effect
</div>
```

## Shadows & Borders

```
Shadows:
shadow-none   → No shadow
shadow-sm     → Small shadow (cards)
shadow-md     → Medium shadow (hover)
shadow-lg     → Large shadow (modals)
shadow-xl     → Extra large shadow

Borders:
border-0      → No border
border        → 1px border
border-2      → 2px border
border-4      → 4px border

Border Styles:
border-solid   → Solid line
border-dashed  → Dashed line
border-dotted  → Dotted line

Rounded Corners:
rounded-none   → No rounding
rounded-sm     → Slight rounding
rounded-md     → Medium rounding
rounded-lg     → Large rounding
rounded-full   → Completely rounded
```

## Common Tailwind Combos

### Card Styles
```tailwind
p-4 bg-white rounded-lg shadow-md border border-gray-200
dark:bg-gray-800 dark:border-gray-700
```

### Button Base
```tailwind
px-4 py-2 rounded-md font-medium transition-colors
hover:bg-opacity-90 disabled:opacity-50
```

### Hover Lift
```tailwind
transition-all duration-300
hover:shadow-lg hover:-translate-y-1
```

### Responsive Stack
```tailwind
flex flex-col gap-2
sm:flex-row sm:gap-4
md:gap-6
```

### Grid Auto Response
```tailwind
grid grid-cols-1
sm:grid-cols-2
md:grid-cols-3
lg:grid-cols-4
gap-4
```

---

## Nuxt UI Component Props Quick List

### UButton
```vue
<UButton
  color="primary"           <!-- primary, gray, red, orange, yellow, green, blue, indigo, purple, pink -->
  variant="solid"           <!-- solid, outline, ghost, soft -->
  size="md"                 <!-- xs, sm, md, lg, xl -->
  icon="i-ph-check"         <!-- Icon name -->
  :disabled="false"         <!-- Disabled state -->
  :loading="false"          <!-- Loading spinner -->
  block                     <!-- Full width -->
/>
```

### UBadge
```vue
<UBadge
  color="primary"           <!-- Badge color -->
  variant="subtle"          <!-- solid, subtle, soft -->
  size="md"                 <!-- sm, md, lg -->
/>
```

### UCard
```vue
<UCard
  :ui="{ base: 'bg-white dark:bg-gray-800' }"
>
  <template #header>Header</template>
  Body content
  <template #footer>Footer</template>
</UCard>
```

### UIcon
```vue
<UIcon 
  name="i-ph-check"         <!-- Icon name -->
  class="w-6 h-6"          <!-- Size via classes -->
/>
```

---

## 🔥 Pro Tips

1. **Mobile-first is best!**
   - Write base styles for mobile
   - Add `md:`, `lg:` for bigger screens

2. **Use semantic colors**
   - Not just colors, but meanings
   - Makes intent clear to other developers

3. **Consistent spacing**
   - Use gap/p in multiples of 4px
   - Prevents random spacing issues

4. **Dark mode always**
   - Add `dark:` variants for everything
   - Users appreciate it!

5. **Animations are subtle**
   - 200-300ms duration usually best
   - Over-animation feels cheap

6. **Test responsiveness**
   - Always check mobile view
   - Use browser dev tools

7. **Performance matters**
   - Tailwind purges unused CSS
   - Smaller bundle = faster load

---

**Keep this card handy! 📌**

Last Updated: December 17, 2025

