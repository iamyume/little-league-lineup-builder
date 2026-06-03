# Agent Instructions for baseball-lineup

This is a single-page web application using a Vanilla JS stack with Halfmoon CSS.

## Architecture
- `index.html`: Main structure, includes Halfmoon CSS and script.
- `style.css`: Minimal custom styling, primarily for print media and conflict highlighting.
- `script.js`: Core logic, state management, and DOM manipulation.

## Key Developer Notes
- **State Management:** The lineup is managed by a `lineup` 2D array and a `players` array.
- **Formations:** Two modes are supported ('CF' and 'LCF') which dictate available dropdown positions.
- **Validation:** Conflicts (duplicate fielding positions in the same inning, excluding 'EH') are highlighted using the `.conflict` CSS class.
- **Drag & Drop:** Implementation uses HTML5 Drag and Drop API. `handleDrop` handles reordering by splicing/inserting rows.
- **Print View:** Styling is optimized via `@media print`. Titles (`h1`, `h2`) and interactive elements (buttons, inputs) are hidden/styled to look like plain text when printed in landscape mode.
- **State Persistence:** This app does not have a backend or storage; state is lost on page refresh.

## Common Operations
- **Adding a player:** Modifies `players` and `lineup` arrays, calls `renderGrid()`.
- **Reordering:** Drag and drop triggers `handleDrop()` which performs array operations and calls `renderGrid()`.
- **Validation logic:** Recalculated on every `renderGrid()` call inside the loop for cell rendering.
- **Git Commits:** After making any changes, create a git commit with a message detailing what was changed.
