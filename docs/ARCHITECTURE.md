# LogicBot - Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [Game Concept](#game-concept)
3. [Technical Architecture](#technical-architecture)
4. [Data Structures](#data-structures)
5. [Component Architecture](#component-architecture)
6. [State Management](#state-management)
7. [Game Engine](#game-engine)
8. [Game Flow](#game-flow)
9. [Adding New Levels](#adding-new-levels)
10. [Development Guide](#development-guide)

---

## Overview

**LogicBot** is an educational visual programming game built with Nuxt 3. Players learn programming concepts by dragging and dropping command blocks to control a robot that navigates a grid, avoiding obstacles and lighting up target cells.

### Tech Stack
- **Framework**: Nuxt 3 (Vue 3)
- **UI Library**: Nuxt UI (Tailwind CSS + Headless UI)
- **State Management**: Pinia
- **Utilities**: VueUse
- **Drag & Drop**: vue-draggable-plus
- **Icons**: Iconify (via Nuxt UI)

---

## Game Concept

### Objective
Control a robot to navigate a grid and light up all target cells (blue cells) by executing a sequence of commands.

### Commands Available
1. **MOVE** (`MOVE`): Move the robot one cell forward in its current direction
2. **TURN_L** (`TURN_L`): Rotate the robot 90° counter-clockwise
3. **TURN_R** (`TURN_R`): Rotate the robot 90° clockwise
4. **LIGHT** (`LIGHT`): Light up the current cell if it's a target cell

### Game Rules
- The robot starts at a predefined position and direction
- The robot cannot move through walls (empty cells) or outside the grid
- Each level has a maximum number of commands allowed
- To win, all target cells must be lit
- The game fails if the robot hits a wall or goes out of bounds

---

## Technical Architecture

### Project Structure
```
app/
├── components/
│   ├── game/
│   │   ├── GameViewport.vue    # Grid visualization
│   │   ├── GameEditor.vue      # Drag & drop editor
│   │   ├── GameControls.vue    # Play/Reset/Speed controls
│   │   └── GameModal.vue       # Win/Fail modals
│   └── AppLogo.vue            # App logo component
├── composables/
│   └── useGameEngine.ts       # Core game execution logic
├── stores/
│   └── game.ts                # Pinia store for game state
├── types/
│   └── game.ts                # TypeScript type definitions
├── data/
│   └── levels.json            # Level definitions
└── pages/
    ├── index.vue              # Landing page
    └── play.vue              # Main game page
```

---

## Data Structures

### Types (`app/types/game.ts`)

#### Direction
```typescript
type Direction = 'N' | 'E' | 'S' | 'W'
```
Represents the four cardinal directions: North, East, South, West.

#### Command
```typescript
type Command = 'MOVE' | 'TURN_L' | 'TURN_R' | 'LIGHT'
```
Available commands the robot can execute.

#### CellType
```typescript
type CellType = 0 | 1 | 2
```
- `0`: Empty cell (wall, cannot traverse)
- `1`: Floor cell (can traverse)
- `2`: Goal cell (target to light up)

#### GameStatus
```typescript
type GameStatus = 'IDLE' | 'RUNNING' | 'WIN' | 'FAIL'
```
Current state of the game execution.

#### Level Interface
```typescript
interface Level {
  id: number                    // Unique level identifier
  title: string                // Level name
  description: string          // Level description
  gridSize: number             // Grid dimensions (NxN)
  layout: CellType[]           // 1D array representing grid (row-major order)
  start: {                     // Starting position
    x: number
    y: number
    dir: Direction
  }
  goals: Position[]            // Array of target positions
  availableBlocks: Command[]    // Commands available for this level
  maxCommands: number          // Maximum commands allowed
}
```

#### Robot Interface
```typescript
interface Robot {
  x: number        // X coordinate (0-indexed)
  y: number        // Y coordinate (0-indexed)
  dir: Direction   // Current facing direction
}
```

### Level Data Format (`app/data/levels.json`)

Levels are stored as JSON arrays. The `layout` array is a 1D representation of a 2D grid using row-major order:

```json
{
  "id": 1,
  "title": "Premier Pas",
  "description": "Avance simplement jusqu'à la case bleue et allume-la !",
  "gridSize": 5,
  "layout": [
    1, 1, 1, 0, 0,    // Row 0
    0, 1, 2, 0, 0,    // Row 1
    0, 1, 0, 0, 0,    // Row 2
    ...
  ],
  "start": { "x": 0, "y": 0, "dir": "E" },
  "goals": [{ "x": 2, "y": 1 }],
  "availableBlocks": ["MOVE", "TURN_L", "TURN_R", "LIGHT"],
  "maxCommands": 12
}
```

**Layout Index Calculation**: For a grid position `(x, y)`:
```typescript
const index = y * gridSize + x
```

---

## Component Architecture

### GameViewport (`app/components/game/GameViewport.vue`)

**Purpose**: Renders the game grid and robot visualization.

**Key Features**:
- CSS Grid layout for responsive grid rendering
- Dynamic cell styling based on `CellType`
- Robot visualization with direction-based rotation
- Visual feedback for lit goals
- Smooth CSS transitions for robot movement

**Key Computed Properties**:
- `robotStyle`: Calculates robot position and rotation based on current state
- `getCellClass()`: Determines CSS classes for each cell based on type and state

**Rendering Logic**:
- Iterates through `level.layout` array
- Converts 1D index to 2D coordinates: `x = index % gridSize`, `y = Math.floor(index / gridSize)`
- Applies conditional classes for empty/floor/goal cells, lit goals, and robot position

### GameEditor (`app/components/game/GameEditor.vue`)

**Purpose**: Provides drag-and-drop interface for building the robot's program.

**Key Features**:
- Drag-and-drop using `vue-draggable-plus`
- Command block palette with available commands
- Program execution area
- Command removal
- Maximum command limit enforcement

**Command Block Configuration**:
```typescript
const commandConfig = {
  MOVE: { label: 'Avancer', icon: 'i-ph-arrow-up', color: 'blue' },
  TURN_L: { label: 'Tourner Gauche', icon: 'i-ph-arrow-counter-clockwise', color: 'yellow' },
  TURN_R: { label: 'Tourner Droite', icon: 'i-ph-arrow-clockwise', color: 'orange' },
  LIGHT: { label: 'Allumer', icon: 'i-ph-lightbulb', color: 'violet' }
}
```

**Drag & Drop Flow**:
1. User drags a command block from the palette
2. Block is added to `program` array via `v-model`
3. `onAdd` handler checks if limit is exceeded
4. If exceeded, shows toast notification and removes the block

### GameControls (`app/components/game/GameControls.vue`)

**Purpose**: Provides game control buttons (Play, Reset, Speed).

**Features**:
- Play button (disabled when program is empty or game is running)
- Reset button (resets robot position and clears lit goals)
- Speed toggle (3 speeds: Slow 1000ms, Normal 500ms, Fast 250ms)
- Next level button (shown on win if next level exists)

**Speed Management**:
- Speed is stored in store as milliseconds per command
- Speed changes affect animation delay in game engine

### GameModal (`app/components/game/GameModal.vue`)

**Purpose**: Displays win/fail modals with appropriate actions.

**Modal Types**:
- **Win Modal**: Shows success message, "Next Level" button (if available), or "Perfect!" button
- **Fail Modal**: Shows failure message and "Retry" button

**Props**:
- `modelValue`: Controls modal visibility
- `type`: `'win' | 'fail'`

---

## State Management

### Game Store (`app/stores/game.ts`)

The Pinia store manages all game state using the Options API pattern.

#### State Properties

```typescript
state: {
  levels: Level[]              // All available levels
  currentLevelId: number      // Currently active level ID
  robot: Robot                // Robot position and direction
  program: Command[]           // User's command sequence
  status: GameStatus          // Current game status
  litGoals: Position[]         // Array of lit goal positions
  executionSpeed: number       // Animation speed in milliseconds
  currentCommandIndex: number  // Index of currently executing command (-1 if none)
}
```

#### Getters

- **`currentLevel`**: Returns the `Level` object for `currentLevelId`
- **`isWin`**: Checks if all goals are lit
- **`canExecute`**: Returns `true` if game is IDLE and program has commands
- **`programLength`**: Returns current program length
- **`hasNextLevel`**: Checks if there's a next level available

#### Actions

- **`loadLevel(levelId)`**: Loads a level and resets game state
- **`nextLevel()`**: Advances to the next level
- **`setProgram(commands)`**: Sets the program array
- **`addCommand(command)`**: Adds a command (with limit check)
- **`removeCommand(index)`**: Removes a command at index
- **`clearProgram()`**: Clears all commands
- **`setStatus(status)`**: Updates game status
- **`setCurrentCommandIndex(index)`**: Sets the executing command index
- **`moveRobot(x, y)`**: Updates robot position
- **`turnRobot(direction)`**: Updates robot direction
- **`lightCell()`**: Adds current position to `litGoals` if it's a goal
- **`reset()`**: Resets robot to start position, clears lit goals
- **`setSpeed(speed)`**: Updates execution speed

---

## Game Engine

### useGameEngine Composable (`app/composables/useGameEngine.ts`)

The game engine handles all command execution logic.

#### Core Functions

**`getDirectionDelta(dir: Direction)`**
- Returns `{ dx, dy }` delta for movement based on direction
- Maps: N → (0, -1), E → (1, 0), S → (0, 1), W → (-1, 0)

**`turnLeft(currentDir: Direction)`**
- Rotates direction counter-clockwise: N→W→S→E→N
- Uses modulo arithmetic: `(index + 3) % 4`

**`turnRight(currentDir: Direction)`**
- Rotates direction clockwise: N→E→S→W→N
- Uses modulo arithmetic: `(index + 1) % 4`

**`isValidPosition(x, y)`**
- Checks if position is within grid bounds
- Checks if cell type is floor (1) or goal (2), not empty (0)

**`executeCommand(command: Command)`**
- Executes a single command:
  - **MOVE**: Calculates new position, validates, updates robot
  - **TURN_L/TURN_R**: Updates robot direction
  - **LIGHT**: Calls `store.lightCell()`
- Returns `true` on success, `false` on failure (collision)

**`execute()`** - Main execution loop
1. Validates program is not empty
2. Sets status to `RUNNING`
3. Resets robot to start position
4. Iterates through each command:
   - Sets `currentCommandIndex` for UI highlighting
   - Executes command
   - If command fails, sets status to `FAIL` and stops
   - Waits `executionSpeed` milliseconds
5. After all commands:
   - Checks win condition (`store.isWin`)
   - Sets status to `WIN` or `FAIL`
   - Shows appropriate toast notification

**`stop()`**
- Sets `shouldStop` flag to interrupt execution
- Resets game state

**`setSpeed(speed: number)`**
- Updates execution speed in store

---

## Game Flow

### Initialization Flow

1. **App Loads** (`app/app.vue`)
   - Header and footer are rendered
   - Navigation links are available

2. **Landing Page** (`app/pages/index.vue`)
   - Displays game introduction
   - "Start Playing" button links to `/play`

3. **Game Page Loads** (`app/pages/play.vue`)
   - Reads `level` query parameter (defaults to 1)
   - Calls `store.loadLevel(levelId)`
   - Renders `GameViewport`, `GameEditor`, `GameControls`

4. **Level Loaded**
   - Store loads level data
   - Robot position set to `level.start`
   - Program cleared
   - Status set to `IDLE`

### Gameplay Flow

1. **Building Program**
   - User drags command blocks from palette to editor
   - Blocks are added to `store.program`
   - Editor enforces `maxCommands` limit

2. **Executing Program**
   - User clicks "Play" button
   - `GameControls` calls `engine.execute()`
   - Engine validates program
   - Engine executes commands sequentially:
     - Updates robot state in store
     - Viewport reactively updates robot visualization
     - Each command waits `executionSpeed` ms

3. **Win Condition**
   - After all commands execute
   - Engine checks `store.isWin` (all goals lit)
   - If win: Status → `WIN`, shows win modal
   - If fail: Status → `FAIL`, shows fail modal

4. **Failure Conditions**
   - Robot hits wall or goes out of bounds
   - Status → `FAIL` immediately
   - Execution stops

5. **Reset Flow**
   - User clicks "Reset"
   - `store.reset()` called
   - Robot returns to start position
   - Lit goals cleared
   - Status → `IDLE`
   - Program remains (can re-execute)

6. **Next Level**
   - On win modal, if next level exists
   - User clicks "Next Level"
   - `store.nextLevel()` called
   - New level loaded, game resets

### Reactive Updates

The app uses Vue's reactivity system:
- Store state changes trigger component updates
- `GameViewport` watches `store.robot` and `store.litGoals`
- `GameEditor` watches `store.program`
- `GameControls` watches `store.status` and `store.canExecute`

---

## Adding New Levels

### Step 1: Create Level Data

Add a new level object to `app/data/levels.json`:

```json
{
  "id": 11,
  "title": "Mon Nouveau Niveau",
  "description": "Description du niveau",
  "gridSize": 6,
  "layout": [
    1, 1, 1, 1, 0, 0,
    0, 0, 1, 1, 1, 0,
    0, 0, 0, 1, 2, 0,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0
  ],
  "start": { "x": 0, "y": 0, "dir": "E" },
  "goals": [{ "x": 4, "y": 2 }],
  "availableBlocks": ["MOVE", "TURN_L", "TURN_R", "LIGHT"],
  "maxCommands": 15
}
```

### Step 2: Layout Design Tips

- Use a grid visualization tool or draw on paper first
- Remember: `layout` is row-major (row by row)
- `gridSize` must match the square root of `layout.length`
- Ensure `start` position is on a floor (1) or goal (2) cell
- Ensure all `goals` are on goal (2) cells

### Step 3: Test the Level

1. Start dev server: `pnpm dev`
2. Navigate to `/play?level=11`
3. Test the level:
   - Verify robot starts correctly
   - Verify goals are visible
   - Verify available blocks match difficulty
   - Verify `maxCommands` is appropriate

---

## Development Guide

### Running the Application

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

### Key Development Concepts

#### CSS Grid for Game Viewport
The viewport uses CSS Grid for responsive layout:
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(var(--grid-size), 1fr);
  grid-template-rows: repeat(var(--grid-size), 1fr);
}
```

#### Drag & Drop Integration
`vue-draggable-plus` provides the `VueDraggable` component:
- Uses `v-model` for two-way binding
- `@add` event fires when item is added
- `handle` prop restricts drag to specific element

#### Toast Notifications
Nuxt UI provides `useToast()` composable:
```typescript
const toast = useToast()
toast.add({
  title: 'Title',
  description: 'Description',
  color: 'success' | 'error' | 'warning',
  icon: 'i-ph-icon-name'
})
```

#### Modal Management
Modals are controlled via `v-model`:
```vue
<GameModal v-model="showWinModal" type="win" />
```

### Common Patterns

#### Accessing Store in Components
```typescript
const store = useGameStore()
const level = computed(() => store.currentLevel)
```

#### Reactive Computed Properties
```typescript
const robotStyle = computed(() => {
  // Calculate based on store state
  return { transform: `translate(...)` }
})
```

#### Watching Store Changes
```typescript
watch(() => store.status, (newStatus) => {
  if (newStatus === 'WIN') {
    // Handle win
  }
})
```

### Debugging Tips

1. **Check Store State**: Use Vue DevTools to inspect Pinia store
2. **Console Logging**: Add logs in `useGameEngine` to trace execution
3. **Grid Visualization**: Print `layout` array to verify grid structure
4. **Position Validation**: Log robot position after each move
5. **Command Execution**: Log each command as it executes

---

## Future Enhancements

Potential features to add:

1. **Level Editor**: Visual tool to create levels
2. **Save Progress**: LocalStorage persistence for completed levels
3. **Statistics**: Track completion time, command count
4. **More Commands**: Loops, conditionals, functions
5. **Multiplayer**: Race mode, collaborative solving
6. **Custom Themes**: Different robot skins, grid themes
7. **Sound Effects**: Audio feedback for actions
8. **Animations**: More elaborate robot movement animations
9. **Tutorial Mode**: Step-by-step guidance for beginners
10. **Level Sharing**: Export/import custom levels

---

## Conclusion

LogicBot demonstrates a clean separation of concerns:
- **Components**: UI and presentation
- **Store**: State management
- **Composables**: Business logic
- **Types**: Type safety
- **Data**: Content (levels)

This architecture makes the codebase maintainable, testable, and extensible.

