# LogicBot 🤖

An educational visual programming game built with Nuxt 3. Learn programming concepts by dragging and dropping command blocks to control a robot that navigates a grid and lights up target cells.

## 🎮 What is LogicBot?

LogicBot is an interactive game that teaches programming fundamentals through visual programming. Players create programs by dragging command blocks, then watch their robot execute the commands to solve puzzles.

### Key Features

- 🎯 **10 Progressive Levels** - From simple paths to complex mazes
- 🧩 **Visual Programming** - Drag and drop command blocks
- 🎨 **Beautiful UI** - Built with Nuxt UI and Tailwind CSS
- ⚡ **Adjustable Speed** - Control animation speed for learning
- 📱 **Responsive Design** - Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd learning-algo

# Install dependencies
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📚 Documentation

- **[User Guide](./docs/USER_GUIDE.md)** - Learn how to play LogicBot
- **[Architecture Documentation](./docs/ARCHITECTURE.md)** - Technical details and development guide

## 🛠️ Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/) (Vue 3)
- **UI Library**: [Nuxt UI](https://ui.nuxt.com/) (Tailwind CSS + Headless UI)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Utilities**: [VueUse](https://vueuse.org/)
- **Drag & Drop**: [vue-draggable-plus](https://github.com/Alfred-Skyblue/vue-draggable-plus)
- **Icons**: [Iconify](https://iconify.design/) (via Nuxt UI)

## 📁 Project Structure

```
app/
├── components/
│   ├── game/
│   │   ├── GameViewport.vue    # Grid visualization
│   │   ├── GameEditor.vue      # Drag & drop editor
│   │   ├── GameControls.vue    # Play/Reset/Speed controls
│   │   └── GameModal.vue       # Win/Fail modals
│   └── AppLogo.vue
├── composables/
│   └── useGameEngine.ts        # Core game execution logic
├── stores/
│   └── game.ts                 # Pinia store for game state
├── types/
│   └── game.ts                 # TypeScript type definitions
├── data/
│   └── levels.json             # Level definitions
└── pages/
    ├── index.vue               # Landing page
    └── play.vue                # Main game page
```

## 🎯 How It Works

1. **Load a Level**: Each level has a grid, starting position, and target cells
2. **Build a Program**: Drag command blocks (MOVE, TURN_L, TURN_R, LIGHT) to create a sequence
3. **Execute**: Click Play to watch the robot execute your commands
4. **Win**: Light up all target cells to complete the level

### Commands

- **MOVE**: Move forward one cell
- **TURN_L**: Rotate 90° counter-clockwise
- **TURN_R**: Rotate 90° clockwise  
- **LIGHT**: Light up the current cell if it's a target

## 🧪 Development

### Available Scripts

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

### Adding New Levels

See the [Architecture Documentation](./docs/ARCHITECTURE.md#adding-new-levels) for detailed instructions on creating new levels.

## 📝 License

This project is private and not licensed for public use.

## 🙏 Acknowledgments

- Built with [Nuxt UI Starter Template](https://github.com/nuxt-ui-templates/starter)
- Inspired by visual programming games like Scratch and Blockly

---

**Happy Programming!** 🚀
