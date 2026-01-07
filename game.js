let identity = 4;
let morale = 3;

const output = document.getElementById("output");
const identitySpan = document.getElementById("identity");
const moraleSpan = document.getElementById("morale");

function choose(path) {
  output.innerHTML = "";

  if (path === "noodle") {
    output.innerHTML = "<p>The steam smells of broth and old memories. The cook avoids your gaze.</p>";
    morale++;
  }

  if (path === "alley") {
    output.innerHTML = "<p>The alley hums softly. Something red glints near the trash.</p>";
    identity++;
  }

  identitySpan.textContent = identity;
  moraleSpan.textContent = morale;
}
