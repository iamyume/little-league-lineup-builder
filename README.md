# Little League Lineup

An interactive, single-page web application to help coaches build, manage, and print lineup orders and player fielding positions for Little League games.

---

## 🚀 Features

### 📋 Lineup Management
- **Dynamic Roster:** Add or remove players instantly.
- **Drag-and-Drop Reordering:** Easily rearrange player batting orders using HTML5 drag-and-drop.
- **Fielding Formations:** Toggle between two standard formats:
  - **Format 1 (CF):** 10-player setup (Pitcher, Catcher, 1B, 2B, 3B, SS, LF, CF, RF, EH).
  - **Format 2 (LCF/RCF):** 11-player setup (Pitcher, Catcher, 1B, 2B, 3B, SS, LF, LCF, RCF, RF, EH).

### 🔍 Real-Time Validation
- **Conflict Highlighting:** Highlights position conflicts (e.g. assigning two players to the same position in the same inning) in light red (excludes Extra Hitter - `EH`).
- **Unfilled Positions Tracker:** The table footer displays a list of unassigned fielding positions for each inning to help you ensure full coverage.

### 💾 Local Storage State Persistence
- All changes—player names, fielding positions, selected formation, and batting order—are automatically saved in the browser's `localStorage` and restored seamlessly upon page refresh.

### 📂 CSV Import & Export
- **Export to CSV:** Export your full roster and inning-by-inning positions to a clean, standard CSV file.
- **Import from CSV:** Load standard CSV spreadsheets into the builder.
- **Auto-Formation Detection:** When importing a CSV, the app scans the data and automatically switches to **Format 2** if LCF or RCF positions are present, or **Format 1** if CF is found.
- **Input Normalization:** Automatically handles lowercase letters (e.g. `1b` to `1B`) and gracefully falls back to `EH` if a position is malformed.

### 🔀 Batting Order Helpers
- **Reverse Order:** Instantly reverses the batting lineup sequence.
- **Randomize Order:** Randomly shuffles the batting order using the Fisher-Yates algorithm while keeping each player's inning positions perfectly linked with them.

### 🖨️ Portrait-Optimized Printable View
- Optimized `@media print` styles for a **Portrait** paper layout.
- Uses **large bold fonts** and high-contrast table borders for maximum readability in the dugout or on the field.
- Automatically hides all interactive controls (buttons, dropdown arrows, headers) to present a clean, professional paper sheet.
- Hides the missing positions tracker in print mode.

---

## 🛠️ Tech Stack

- **HTML5** & **Vanilla JavaScript (ES6+)**
- **CSS3** with the **Halfmoon CSS Framework** (Variables & utility-driven design)
- **Local Storage API** (for client-side state)

---

## 📂 How to Run

Because this app uses Vanilla JS, there are no dependencies or build steps.
1. Clone this repository.
2. Open `index.html` in any modern web browser.
