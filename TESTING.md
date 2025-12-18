# LogicBot Testing Guide

Complete testing suite for the LogicBot educational game application.

## Quick Start

### Install test dependencies
```bash
pnpm install
```

### Run all tests
```bash
pnpm test
```

### Watch mode (for development)
```bash
pnpm test -- --watch
```

### Generate coverage report
```bash
pnpm test:coverage
```

### Interactive UI (Vitest dashboard)
```bash
pnpm test:ui
```

## Test Files Overview

### 1. Unit Tests - Game Store
**File**: `tests/unit/stores/game.test.ts`
**Lines**: 350+
**Tests**: 30+

Tests all Pinia store functionality:
- ✅ State initialization
- ✅ Command management (add, remove, set, clear)
- ✅ Robot movement and direction
- ✅ Goal detection and lighting
- ✅ Level loading and progression
- ✅ Game status transitions
- ✅ Getters (win condition, execution validation)
- ✅ Speed control

### 2. Unit Tests - Game Engine
**File**: `tests/unit/composables/useGameEngine.test.ts`
**Lines**: 300+
**Tests**: 25+

Tests core game mechanics:
- ✅ Robot movement calculations
- ✅ Goal detection logic
- ✅ Win condition determination
- ✅ Program execution flow
- ✅ Level progression
- ✅ State machine transitions
- ✅ Error handling
- ✅ Speed control mechanics

### 3. Component Tests - GameEditor
**File**: `tests/components/GameEditor.test.ts`
**Lines**: 280+
**Tests**: 15+

Tests UI component behavior:
- ✅ Component rendering
- ✅ Program counter display
- ✅ Command block rendering
- ✅ Add/delete functionality
- ✅ Drag and drop reordering
- ✅ Progress bar calculation
- ✅ Button state management
- ✅ Visual feedback

### 4. Integration Tests
**File**: `tests/integration/game-flow.test.ts`
**Lines**: 350+
**Tests**: 10+

Tests complete game scenarios:
- ✅ Full game session (load → play → win/fail)
- ✅ Multi-level progression
- ✅ Error recovery workflows
- ✅ Program reordering
- ✅ Speed adjustments
- ✅ Goal validation
- ✅ Command limit enforcement
- ✅ State preservation
- ✅ Data integrity

## Test Coverage Matrix

| Component | Coverage | Tests | Status |
|-----------|----------|-------|--------|
| Game Store | ~90% | 30+ | ✅ |
| Game Engine | ~85% | 25+ | ✅ |
| GameEditor | ~75% | 15+ | ✅ |
| Game Flow | ~80% | 10+ | ✅ |
| **Total** | **~85%** | **80+** | ✅ |

## Key Test Scenarios

### Scenario 1: Successful Level Completion
```
1. Load Level 1
2. Add commands: MOVE, MOVE, LIGHT
3. Execute program
4. Robot moves to goal and lights it
5. Status → WIN
6. Progress to Level 2
```
**Test**: `game-flow.test.ts` → "should complete a full game session"

### Scenario 2: Failed Attempt & Recovery
```
1.
