# UI Design Guideline: Neon Cyber Theme

This guideline outlines the design system for the "Learning Algo" application, inspired by futuristic, synthwave, and neon game interfaces.

## 1. Color Palette

The theme is built around a "Dark Mode" foundation with high-contrast neon accents.

| Semantic Name | Color Name | HEX | Usage |
|---------------|------------|-----|-------|
| **Background**| Cyber 950  | `#0d0d17` | Main app background |
| **Neutral**   | Cyber 900  | `#1a1a2e` | Card backgrounds, section headers |
| **Primary**   | Cyan 500   | `#00d4ff` | Interactive elements, active states, robot glow |
| **Secondary** | Magenta 500| `#ff009d` | Secondary actions, decorative borders, headers |
| **Success**   | Neon Green | `#39ff14` | Completed tasks, active grid blocks |
| **Warning**   | Yellow     | `#ffea00` | Pending states |
| **Error**     | Red        | `#ff003c` | Errors, destructive actions |

## 2. Typography

- **Sans-serif**: `Public Sans` (General UI labels, buttons, navigation).
- **Monospace**: `JetBrains Mono` (Programming blocks, code logic, terminal outputs).

## 3. Visual Style

### Borders & Glows
- **Border Radius**: Use `rounded-md` (8px) as the standard for containers and buttons.
- **Border Width**: 2px for primary containers to create a distinct "block" look.
- **Neon Glow**: Every neon border should be accompanied by a subtle `box-shadow` of the same color.
  - Class: `.border-neon-cyan`, `.border-neon-magenta`.

### Containers (Cards)
Containers should have a slightly lighter background than the main page (`cyber-900`) and a glowing border of the secondary color (`magenta`) or primary (`cyan`).

### Buttons
- Primary buttons: Cyan background with white/inverted text.
- Ghost/Outline buttons: Neon borders with glowing effects on hover.

## 4. Nuxt UI Implementation

### CSS Variables
We override the default Nuxt UI tokens in `app/assets/css/main.css`:
```css
:root {
  --ui-primary: var(--ui-color-cyan-500);
  --ui-secondary: var(--ui-color-magenta-500);
  --ui-neutral: var(--ui-color-cyber-900);
  --ui-radius: 0.5rem;
}
```

### Component Usage
- Use `<UButton color="primary">` for cyan buttons.
- Use `<UButton color="secondary">` for magenta buttons.
- Use `<UCard class="border-neon-magenta bg-cyber-900">` for main logic containers.

---
*Created on 2025-12-17*

