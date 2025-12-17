# LogicBot - User Guide

## Welcome to LogicBot! 🤖

LogicBot is an educational game that teaches programming concepts through visual programming. Control a robot by dragging and dropping command blocks to solve puzzles!

---

## How to Play

### Objective
Your goal is to program the robot to navigate the grid and light up all the **blue target cells**.

### Getting Started

1. **Start the Game**
   - Click "Jouer" (Play) from the homepage or header
   - You'll start at Level 1

2. **Understand the Grid**
   - **Gray cells**: Floor - the robot can walk here
   - **Blue cells**: Target cells - you need to light these up
   - **Black cells**: Walls - the robot cannot go here
   - **Robot**: The colored square with an arrow showing its direction

3. **Build Your Program**
   - Drag command blocks from the **palette** (top section) to the **program area** (bottom section)
   - Arrange blocks in the order you want them executed
   - Remove blocks by clicking the ❌ button

4. **Execute Your Program**
   - Click the **"Jouer"** (Play) button
   - Watch the robot execute your commands step by step
   - The robot will move, turn, and light cells according to your program

5. **Win the Level**
   - All blue target cells must be lit
   - If successful, you'll see a victory message!
   - Click "Niveau Suivant" (Next Level) to continue

---

## Commands Explained

### 🟦 MOVE (Avancer)
- Moves the robot **one cell forward** in the direction it's facing
- The robot cannot move through walls or outside the grid
- If the robot hits a wall, the game fails

### 🟨 TURN_L (Tourner Gauche)
- Rotates the robot **90° counter-clockwise** (left)
- The robot stays in the same cell, only its direction changes
- Direction cycle: North → West → South → East → North

### 🟧 TURN_R (Tourner Droite)
- Rotates the robot **90° clockwise** (right)
- The robot stays in the same cell, only its direction changes
- Direction cycle: North → East → South → West → North

### 🟪 LIGHT (Allumer)
- Lights up the current cell **if it's a target cell**
- If the robot is not on a target cell, nothing happens
- You must light up **all** target cells to win

---

## Game Controls

### Play Button ▶️
- Starts executing your program
- Disabled if:
  - Your program is empty
  - The game is already running
- Click to watch your robot in action!

### Reset Button 🔄
- Resets the robot to its starting position
- Clears all lit goals
- **Keeps your program** - you can try again without rebuilding
- Useful for testing different approaches

### Speed Button ⚡
- Changes animation speed
- Three speeds available:
  - **Lent** (Slow): 1000ms per command - easier to follow
  - **Normal**: 500ms per command - balanced
  - **Rapide** (Fast): 250ms per command - quick execution
- Click to cycle through speeds

### Next Level Button 🎯
- Appears when you win a level
- Takes you to the next challenge
- Only available if there's a next level

---

## Tips & Strategies

### 🎯 Planning Your Solution
1. **Visualize the path**: Trace the route from start to all targets
2. **Count moves**: Estimate how many MOVE commands you'll need
3. **Plan turns**: Figure out when you need to change direction
4. **Check limits**: Each level has a maximum command limit

### 🔄 Debugging Your Program
- If the robot hits a wall, check your MOVE commands
- If you don't light all targets, verify you're using LIGHT on target cells
- Use Reset to try again without rebuilding your program
- Start with Slow speed to see exactly what's happening

### 💡 Common Patterns

**Moving in a Straight Line**
```
MOVE → MOVE → MOVE
```

**Turning a Corner**
```
MOVE → TURN_R → MOVE → MOVE
```

**Lighting Multiple Targets**
```
MOVE → MOVE → LIGHT → TURN_R → MOVE → LIGHT
```

**Going Back**
```
TURN_R → TURN_R → MOVE  (Turn 180°)
```

### ⚠️ Common Mistakes

1. **Forgetting to Light**: Moving to a target isn't enough - you must use LIGHT!
2. **Wrong Direction**: Make sure the robot is facing the right way before moving
3. **Hitting Walls**: Plan your path to avoid empty cells
4. **Exceeding Limit**: Each level has a maximum number of commands

---

## Level Progression

### Beginner Levels (1-3)
- Simple paths
- Few commands needed
- Learn basic movement and lighting

### Intermediate Levels (4-6)
- More complex paths
- Multiple targets
- Require planning and efficiency

### Advanced Levels (7-10)
- Complex mazes
- Strategic thinking required
- Optimize your solution to fit within command limits

---

## Troubleshooting

### The robot doesn't move
- Check that you clicked "Jouer" (Play)
- Verify your program has commands
- Make sure the game isn't already running

### The robot goes through walls
- This shouldn't happen! If it does, it's a bug - please report it
- The robot should stop and fail when hitting a wall

### I can't add more blocks
- You've reached the maximum command limit for this level
- Try optimizing your solution
- Remove unnecessary commands

### The game says I failed but I lit all targets
- Make sure you lit **all** target cells
- Some levels have multiple targets
- Check that all blue cells are glowing

### Reset doesn't work
- Make sure you're clicking the Reset button, not just refreshing the page
- The Reset button keeps your program but resets the robot position

---

## Keyboard Shortcuts

Currently, LogicBot is primarily mouse/touch-based. Future versions may include:
- Spacebar: Play/Pause
- R: Reset
- Arrow keys: Quick navigation

---

## Need Help?

### Understanding the Game
- Read the level description at the top
- Look at the grid carefully before starting
- Start with simple solutions and refine them

### Technical Issues
- Make sure you're using a modern browser
- Try refreshing the page
- Clear your browser cache if problems persist

---

## Have Fun! 🎉

LogicBot is designed to make learning programming fun and intuitive. Don't worry if you don't get it right the first time - that's part of learning! Experiment, try different approaches, and enjoy the challenge.

**Happy programming!** 🚀

