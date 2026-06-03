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
    "<th>Name</th>" +
    Array(6)
      .fill(0)
      .map((_, i) => `<th class="text-center">${i + 1}</th>`)
      .join("");

  const body = document.getElementById("grid-body");
  body.innerHTML = "";

  players.forEach((player, pIdx) => {
    let row = `<tr draggable="true" ondragstart="handleDragStart(${pIdx})" ondrop="handleDrop(${pIdx})" ondragover="event.preventDefault()">
        <td>
          <div class="input-group">
            <button class="btn btn-danger" onclick="removePlayer(${pIdx})">&times;</button>
            <input type="text" class="form-control" value="${player}" onchange="players[${pIdx}]=this.value; saveState()">
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
                <select class="form-control" onchange="lineup[${pIdx}][${i}]=this.value; saveState(); renderGrid()">
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
  const insert = target > draggedPlayerIndex ? target : target;
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

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  renderGrid();
});
