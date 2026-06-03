let players = Array.from({ length: 12 }, (_, i) => `Player ${i + 1}`);
let formation = "CF";
const positions = {
  CF: ["P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "EH"],
  LCF: ["P", "C", "1B", "2B", "3B", "SS", "LF", "LCF", "RCF", "RF", "EH"],
};
let lineup = Array(12)
  .fill(0)
  .map(() => Array(6).fill("EH"));

let draggedPlayerIndex = null;

function saveState() {
  localStorage.setItem("baseball_players", JSON.stringify(players));
  localStorage.setItem("baseball_formation", formation);
  localStorage.setItem("baseball_lineup", JSON.stringify(lineup));
}

function loadState() {
  const savedPlayers = localStorage.getItem("baseball_players");
  const savedFormation = localStorage.getItem("baseball_formation");
  const savedLineup = localStorage.getItem("baseball_lineup");

  if (savedPlayers) {
    players = JSON.parse(savedPlayers);
  }
  if (savedFormation) {
    formation = savedFormation;
    const select = document.getElementById("formation-select");
    if (select) select.value = formation;
  }
  if (savedLineup) {
    lineup = JSON.parse(savedLineup);
  }
}

function renderGrid() {
  const header = document.getElementById("grid-header");
  header.innerHTML =
    "<th></th><th>Name</th>" +
    Array(6)
      .fill(0)
      .map((_, i) => `<th class="text-center">${i + 1}</th>`)
      .join("");

  const body = document.getElementById("grid-body");
  body.innerHTML = "";

  players.forEach((player, pIdx) => {
    let row = `<tr draggable="false" ondrop="handleDrop(${pIdx}); this.classList.remove('drag-over')" ondragover="event.preventDefault()" ondragenter="this.classList.add('drag-over')" ondragleave="this.classList.remove('drag-over')">
        <td class="drag-handle" draggable="true" ondragstart="handleDragStart(${pIdx})" style="cursor: grab; text-align: center; vertical-align: middle;">&#9776;</td>
        <td>
          <div class="input-group">
            <button class="btn btn-danger btn-lg" onclick="removePlayer(${pIdx})">&times;</button>
            <input type="text" class="form-control form-control-lg" tabindex="${pIdx + 1}" value="${player}" onchange="players[${pIdx}]=this.value; saveState()" onkeydown="if(event.key==='Enter'){event.preventDefault(); document.querySelector(\`[tabindex='${pIdx + 2}']\`)?.focus()}">
          </div>
        </td>`;
    for (let i = 0; i < 6; i++) {
      const pos = lineup[pIdx][i];
      const isConflict =
        pos !== "" &&
        pos !== "EH" &&
        players.some(
          (_, otherPIdx) => otherPIdx !== pIdx && lineup[otherPIdx][i] === pos,
        );
      row += `<td class="${isConflict ? "conflict" : ""}">
                <select class="form-select form-select-lg" onchange="lineup[${pIdx}][${i}]=this.value; saveState(); renderGrid()">
                    ${positions[formation].map((p) => `<option value="${p}" ${pos === p ? "selected" : ""}>${p}</option>`).join("")}
                </select>
            </td>`;
    }
    row += "</tr>";
    body.innerHTML += row;
  });

  const footer = document.getElementById("grid-footer");
  footer.innerHTML =
    `<tr><td>Missing</td>` +
    Array(6)
      .fill(0)
      .map((_, inning) => {
        const used = new Set(players.map((_, pIdx) => lineup[pIdx][inning]));
        return `<td>${positions[formation].filter((p) => !used.has(p)).join(", ")}</td>`;
      })
      .join("") +
    `</tr>`;
}

function handleDragStart(i) {
  draggedPlayerIndex = i;
}
function handleDrop(target) {
  if (draggedPlayerIndex === null || draggedPlayerIndex === target) return;
  
  const p = players.splice(draggedPlayerIndex, 1)[0];
  const l = lineup.splice(draggedPlayerIndex, 1)[0];
  
  // If we removed something before target, target index decreased by 1
  const insert = (draggedPlayerIndex < target) ? target - 1 : target;
  
  players.splice(insert, 0, p);
  lineup.splice(insert, 0, l);
  
  saveState();
  renderGrid();
}

function removePlayer(i) {
  players.splice(i, 1);
  lineup.splice(i, 1);
  saveState();
  renderGrid();
}

function addPlayer() {
  players.push(`Player ${players.length + 1}`);
  lineup.push(Array(6).fill("EH"));
  saveState();
  renderGrid();
}

function updateFormation() {
  formation = document.getElementById("formation-select").value;
  saveState();
  renderGrid();
}

function exportCSV() {
  const header = ["Name", "1", "2", "3", "4", "5", "6"];
  let csvContent = header.join(",") + "\n";
  
  players.forEach((player, pIdx) => {
    const escapedName = `"${player.replace(/"/g, '""')}"`;
    const row = [escapedName, ...lineup[pIdx]];
    csvContent += row.join(",") + "\n";
  });
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "baseball_lineup.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function parseCSVLine(text) {
  const result = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function importCSV(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
    
    if (lines.length <= 1) {
      alert("Invalid CSV file (must contain at least a header and player row).");
      return;
    }
    
    // Detect formation from the parsed data
    let hasLCForRCF = false;
    let hasCF = false;
    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i]);
      if (row.length === 0 || !row[0]) continue;
      for (let j = 1; j < row.length; j++) {
        const val = row[j] ? row[j].trim().toUpperCase() : "";
        if (val === "LCF" || val === "RCF") {
          hasLCForRCF = true;
        } else if (val === "CF") {
          hasCF = true;
        }
      }
    }
    
    if (hasLCForRCF) {
      formation = "LCF";
    } else if (hasCF) {
      formation = "CF";
    }
    
    const select = document.getElementById("formation-select");
    if (select) {
      select.value = formation;
    }
    
    const parsedPlayers = [];
    const parsedLineup = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const row = parseCSVLine(line);
      if (row.length === 0 || !row[0]) continue;
      
      const name = row[0].trim();
      if (name === "") continue;
      
      const playerLineup = [];
      for (let inning = 1; inning <= 6; inning++) {
        const pos = row[inning] ? row[inning].trim().toUpperCase() : "EH";
        const validPositions = positions[formation];
        if (validPositions.includes(pos)) {
          playerLineup.push(pos);
        } else {
          playerLineup.push("EH");
        }
      }
      
      parsedPlayers.push(name);
      parsedLineup.push(playerLineup);
    }
    
    if (parsedPlayers.length > 0) {
      players = parsedPlayers;
      lineup = parsedLineup;
      saveState();
      renderGrid();
    } else {
      alert("No players found in CSV.");
    }
    
    event.target.value = "";
  };
  reader.readAsText(file);
}

function reversePlayers() {
  players.reverse();
  lineup.reverse();
  saveState();
  renderGrid();
}

function randomizePlayers() {
  const paired = players.map((player, idx) => ({ player, lineupRow: lineup[idx] }));
  
  // Fisher-Yates Shuffle
  for (let i = paired.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = paired[i];
    paired[i] = paired[j];
    paired[j] = temp;
  }
  
  players = paired.map(item => item.player);
  lineup = paired.map(item => item.lineupRow);
  
  saveState();
  renderGrid();
}

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  renderGrid();
});
