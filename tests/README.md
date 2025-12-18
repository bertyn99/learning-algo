# Game Testing Suite

Comprehensive test suite for LogicBot educational game application.

## Test Structure

```
tests/
├── unit/
│   ├── stores/
│   │   └── game.test.ts              # Pinia store tests
│   └── composables/
│       └── useGameEngine.test.ts     # Game logic tests
├── components/
│   └── GameEditor.test.ts            # Component tests
├── integration/
│   └── game-flow.test.ts             # End-to-end flow tests
└── README.md
```

## Running Tests

### Run all tests
```bash
pnpm test
```

### Run tests in watch mode
```bash
pnpm test -- --watch
```

### Run tests with UI
```bash
pnpm test:ui
```

### Generate coverage report
```bash
pnpm test:coverage
```

### Run specific test file
```bash
pnpm test tests/unit/stores/game.test.ts
```

## Test Coverage

### Unit Tests - Game Store (`tests/unit/stores/game.test.ts`)

Tests core game state management using Pinia:

- **State Management**: Initialization, default values
- **Program Management**: Add, remove, clear, set commands
- **Robot Movement**: Position updates, direction changes
- **Goal Lighting**: Lighting goals, duplicate prevention
- **Level Management**: Load, progress, reset operations
- **Game Status**: Status transitions, win conditions
- **Getters**: Win detection, execution validation
- **Speed Control**: Speed adjustment and persistence

**Key Test Cases**: 30+ test cases covering all store actions and getters

### Unit Tests - Game Engine (`tests/unit/composables/useGameEngine.test.ts`)

Tests game logic and mechanics:

- **Robot Movement**: Direction deltas, position validation
- **Goal Detection**: Goal identification, validation
- **Win Condition**: Win/fail detection logic
- **Program Execution**: Command tracking, validation
- **Level Progression**: Level structure, data integrity
- **State Transitions**: IDLE → RUNNING → WIN/FAIL → IDLE
- **Error Handling**: Invalid inputs, boundary conditions
- **Speed Control**: Multiple speed levels, persistence

**Key Test Cases**: 25+ test cases covering all game mechanics

### Component Tests - GameEditor (`tests/components/GameEditor.test.ts`)

Tests UI component behavior:

- **Component Mounting**: Rendering, initialization
- **Program Counter**: Display accuracy, updates
- **Command Blocks**: Rendering, labels, indices
- **Add Command**: Adding commands, limit enforcement
- **Delete Command**: Removing commands, index updates
- **Drag and Drop**: Reordering, integrity maintenance
- **Progress Bar**: Display, percentage calculation
- **Library Buttons**: State (enabled/disabled)
- **Drag State Feedback**: Visual feedback tracking

**Key Test Cases**: 15+ test cases covering UI interactions

### Integration Tests - Game Flow (`tests/integration/game-flow.test.ts`)

Tests complete game scenarios:

- **Complete Session**: Full game from start to win/fail
- **Level Progression**: Multi-level gameplay
- **Error Recovery**: Failed attempts, retry flow
- **Program Reordering**: Modifying during planning
- **Speed Control**: Adjustment between attempts
- **Goal Validation**: Goal completion logic
- **Command Limit**: Enforcement and removal
- **State Preservation**: Session data consistency
- **Level Data Integrity**: Consistent level structure
- **Realistic Scenarios**: Complex user interactions

**Key Test Cases**: 10+ end-to-end scenarios

## Test Framework

- **Vitest**: Fast unit test framework
- **Vue Test Utils**: Vue component testing
- **Pinia**: State management testing
- **Happy DOM**: Lightweight DOM implementation

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Writing New Tests

### Store Tests
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '~/stores/game'

describe('Feature Name', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should do something', () => {
    const store = useGameStore()
    // Test implementation
  })
})
```

### Component Tests
```typescript
import { mount } from '@vue/test-utils'
import Component from '~/components/Component.vue'

it('should render', () => {
  const wrapper = mount(Component, {
    global: {
      plugins: [createPinia()],
      stubs: { VueDraggable: true },
    },
  })
  expect(wrapper.exists()).toBe(true)
})
```

## CI/CD Integration

Tests are run automatically on:
- Pull requests
- Commits to main/develop branches
- Pre-deployment checks

## Debugging Tests

### Enable verbose logging
```bash
pnpm test -- --reporter=verbose
```

### Run single test
```bash
pnpm test -- -t "test name pattern"
```

### Debug in browser
```bash
pnpm test:ui
```

## Common Issues

### Issue: Tests timeout
**Solution**: Increase timeout in test: `it('test', () => {}, { timeout: 10000 })`

### Issue: State not updating
**Solution**: Use `await wrapper.vm.$nextTick()` in component tests

### Issue: Pinia state not isolated
**Solution**: Ensure `beforeEach` creates new pinia with `createPinia()`

## Performance

- Average test suite run: < 5 seconds
- Coverage report generation: < 10 seconds
- UI test startup: < 3 seconds

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain >80% coverage
4. Add integration tests for complex flows

