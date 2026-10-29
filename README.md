# Interactive Quiz Game Application

A modern, responsive, and lightweight Quiz Game built using pure HTML5, CSS3, and Vanilla JavaScript.

## Features
- **Modern Clean Interface**: Centered card layout with harmonious indigo color scheme, soft gradients, and subtle shadows.
- **Dynamic Quiz Flow**:
  - Welcome screen with question count customization (5 or 10 questions) and saved high score.
  - Question screen with real-time question tracker ("Question X of Y") and smooth animated progress bar.
  - 15-second countdown timer per question with visual warning when time is low.
  - Clickable option cards with letter badges (A, B, C, D).
  - Instant visual feedback on answer selection (green for correct, red for incorrect) with automatic reveal of the correct answer.
  - Prevents multiple selections per question.
- **Results & Performance**:
  - Displays final score, percentage, and tailored feedback messages.
  - Detailed breakdown of correct vs. incorrect answers.
  - High score tracking stored persistently in `localStorage`.
  - Seamless "Restart Quiz" button that resets and starts fresh without refreshing the webpage.
- **Fully Responsive**: Optimized for seamless interaction across mobile, tablet, and desktop viewports.
- **Clean Architecture**: Strict separation of concerns (HTML, CSS, JavaScript) without third-party frameworks.

## Project Structure
```
├── index.html   # Semantic HTML markup and layout
├── style.css    # Modern CSS design system and responsive styles
├── script.js    # Vanilla JavaScript quiz engine and event handlers
└── README.md    # Documentation
```

## How to Run
Simply open `index.html` in any modern web browser or serve it using any local static file server.
