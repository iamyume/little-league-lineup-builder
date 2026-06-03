# Agent Instructions for baseball-lineup

This is a single-page web application using a Vanilla JS stack with Halfmoon CSS.

## Architecture
- `index.html`: Main structure, includes Halfmoon CSS and script.
- `style.css`: Minimal custom styling, primarily for print media and conflict highlighting.
- `script.js`: Core logic, state management, and DOM manipulation.

## Key Developer Notes
- **State Management:** The lineup is managed by a `lineup` 2D array and a `players` array. State is persisted in `localStorage`.
- **Formations:** Two modes are supported ('CF' and 'LCF') which dictate available dropdown positions. Auto-detected during CSV import.
- **Validation:** Conflicts (duplicate fielding positions in the same inning, excluding 'EH') are highlighted using the `.conflict` CSS class.
- **Drag & Drop:** Implementation uses HTML5 Drag and Drop API. `handleDrop` handles reordering by splicing/inserting rows.
- **Print View:** Styling is optimized via `@media print` for portrait orientation, with large fonts, hidden controls, and a hidden footer.
- **CSV Support:** Includes RFC 4180 compliant CSV import and export, with automatic formation detection.
- **Order Manipulation:** Players can be reversed or randomized using Fisher-Yates shuffle.

## Common Operations
- **Adding/Reordering/Removing:** All modify state arrays and call `renderGrid()` and `saveState()`.
- **Import/Export:** `exportCSV()` generates a blob URL for download. `importCSV()` uses a `FileReader` and state machine parser.
- **Git Commits:** After making any changes, create a git commit with a message detailing what was changed.
