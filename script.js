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
            <input type="text" class="form-control" value="${player}" onchange="players[${pIdx}]=this.value">
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
                <select class="form-control" onchange="lineup[${pIdx}][${i}]=this.value; renderGrid()">
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
  renderGrid();
}

function removePlayer(i) {
  players.splice(i, 1);
  lineup.splice(i, 1);
  renderGrid();
}

function addPlayer() {
  players.push(`Player ${players.length + 1}`);
  lineup.push(Array(6).fill("EH"));
  renderGrid();
}

function updateFormation() {
  formation = document.getElementById("formation-select").value;
  renderGrid();
}

document.addEventListener("DOMContentLoaded", renderGrid);
