# **App Name**: Star Defender: Evolution

## Core Features:

- Score Tracking: Tracks the player's score, incrementing each time an opponent is converted to a star.
- Life Counter: Manages the player's lives, decreasing by one upon collision with an enemy shot. Ends the game when lives reach zero.
- Advanced Opponent: Introduces a more challenging boss opponent (pentagon) with increased speed after the initial opponent (triangle) is defeated.
- Collision Detection: Handles collisions between player, opponents, and shots, updating game state accordingly.
- Game Over/Win States: Detects game over conditions (no lives remaining) or win conditions (defeating the boss) and displays the appropriate screen.
- Event Handling: Listens for keyboard and touch events to control player movement and shooting.
- Dynamic Level Scaling: Uses a generative tool to dynamically increase the difficulty each round, or adaptively increase/decrease difficulty to keep players in an optimal state of flow.

## Style Guidelines:

- Primary color: #FF69B4 (Hot Pink) - A vibrant pink to capture the 90s arcade vibe.
- Secondary color: #7DF9FF (Aquamarine) - Cool, contrasting color reminiscent of 90s aesthetics.
- Background color: #000000 (Black) - A dark backdrop to make the pink and aquamarine elements pop.
- Font: 'Press Start 2P', a pixelated font that evokes classic 90s arcade games. Note: currently only Google Fonts are supported.
- Code Font: 'Source Code Pro' for any displayed variables.
- Use pixelated icons reminiscent of 90s games to represent lives and score.
- Display score and lives in the top corners of the screen, using a pixelated font for a retro feel. Consider mobile devices.
- Implement simple, blocky animations for enemy explosions and score updates to reflect the 90s arcade style.