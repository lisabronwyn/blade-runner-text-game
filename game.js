// ------------------- Player State -------------------
const player = {
    location: "Neon Alley",
    inventory: [],
    memories: {},
    moraleScore: 0,
    identityStability: 5
};

// ------------------- Locations & Events -------------------
const locations = {
    "Neon Alley": {
        text: "Rain slicks the pavement. Neon kanji reflects in puddles. Shadows move unseen.",
        choices: {
            "Enter the Noodle Bar": "Noodle Bar",
            "Inspect the Drone": "Drone Encounter",
            "Walk to Offworld Alley": "Offworld Alley"
        }
    },
    "Noodle Bar": {
        text: "Steam fogs the windows. The cook avoids your gaze.",
        choices: {
            "Ask about the Red Dream": "Memory Trigger",
            "Leave quietly": "Neon Alley"
        }
    },
    "Drone Encounter": { text: "", choices: {} },
    "Memory Trigger": { text: "", choices: {} },
    "Offworld Alley": {
        text: "Empty and silent. Flickering holo-ads show fragmented memories.",
        choices: {
            "Investigate the Hologram": "HoloMemory",
            "Return to Neon Alley": "Neon Alley",
            "Enter Corporate HQ": "Corporate HQ"
        }
    },
    "HoloMemory": { text: "", choices: {} },
    "Corporate HQ": {
        text: "Towering glass walls reflect neon rain. Drones patrol silently.",
        choices: {
            "Sneak into Server Room": "Server Room",
            "Confront the Replicant": "Confront Replicant",
            "Return to Offworld Alley": "Offworld Alley"
        }
    },
    "Server Room": { text: "", choices: {} },
    "Confront Replicant": { text: "", choices: {} },
    // Secret collectibles
    "Tyrell Note": {
        text: "A handwritten note from Tyrell Corporation: 'Truth is a luxury.'",
        choices: { "Return to Noodle Bar": "Noodle Bar" }
    },
    "Neon Locket": {
        text: "A small locket flickers neon pink. Memories trapped inside.",
        choices: { "Return to Offworld Alley": "Offworld Alley" }
    }
};

// ------------------- DOM References -------------------
const output = document.getElementById("output");
const choicesDiv = document.getElementById("choices");
const statusDiv = document.getElementById("status");

// ------------------- Utility -------------------
function clearScreen() {
    output.innerHTML = "";
    choicesDiv.innerHTML = "";
}

function adjustIdentity(amount) {
    player.identityStability = Math.max(0, Math.min(10, player.identityStability + amount));
}

function adjustMorale(amount) {
    player.moraleScore += amount;
}

function pickup(item) {
    if (!player.inventory.includes(item)) {
        player.inventory.push(item);
        output.innerHTML += `<p class="pickup">Collected: ${item}</p>`;
        updateStatus();
    }
}

function updateStatus() {
    statusDiv.innerText = `Identity: ${player.identityStability} | Morale: ${player.moraleScore}`;
}

// ------------------- Secret paths -------------------
function checkSecretPaths(location) {
    const secrets = [];
    if (location === "Noodle Bar" && player.memories.redDream && !player.inventory.includes("Tyrell Note")) {
        secrets.push({ text: "Read the hidden note behind the menu", dest: "Tyrell Note" });
    }
    if (location === "Offworld Alley" && player.inventory.includes("Hidden Memory") && !player.inventory.includes("Neon Locket")) {
        secrets.push({ text: "Find the Neon Locket in the puddle", dest: "Neon Locket" });
    }
    return secrets;
}

// ------------------- Event Functions -------------------
function droneEncounter() {
    clearScreen();
    output.innerHTML += "<p>The drone hums, hesitating. Its lens scans your soul.</p>";

    const hackBtn = document.createElement("button");
    hackBtn.innerText = "Hack Drone";
    hackBtn.onclick = () => {
        output.innerHTML += "<p>You uncover forbidden files. Identity shakes.</p>";
        player.memories.droneHack = true;
        adjustIdentity(-1);
        pickup("Encrypted File");
        setTimeout(() => showLocation("Neon Alley"), 500);
    };
    choicesDiv.appendChild(hackBtn);

    const destroyBtn = document.createElement("button");
    destroyBtn.innerText = "Destroy Drone";
    destroyBtn.onclick = () => {
        output.innerHTML += "<p>Sparks fly. Morale score decreases.</p>";
        adjustMorale(-1);
        setTimeout(() => showLocation("Neon Alley"), 500);
    };
    choicesDiv.appendChild(destroyBtn);
}

function memoryTrigger() {
    clearScreen();
    output.innerHTML += "<p>The word 'red' echoes inside. Memory integrity shaken.</p>";
    player.memories.redDream = true;
    adjustIdentity(-1);
    pickup("Red Dream Fragment");

    const continueBtn = document.createElement("button");
    continueBtn.innerText = "Return";
    continueBtn.onclick = () => showLocation("Noodle Bar");
    choicesDiv.appendChild(continueBtn);
}

function holoMemory() {
    clearScreen();
    output.innerHTML += "<p>A hologram flickers: a future that might never exist.</p>";

    const interveneBtn = document.createElement("button");
    interveneBtn.innerText = "Intervene";
    interveneBtn.onclick = () => {
        output.innerHTML += "<p>You alter the memory. Moral rises, identity falters.</p>";
        adjustMorale(1); adjustIdentity(-1);
        pickup("Altered Holo Memory");
        setTimeout(() => showLocation("Offworld Alley"), 500);
    };
    choicesDiv.appendChild(interveneBtn);

    const watchBtn = document.createElement("button");
    watchBtn.innerText = "Watch Silently";
    watchBtn.onclick = () => {
        output.innerHTML += "<p>You watch. Morale drifts down.</p>";
        adjustMorale(-1);
        setTimeout(() => showLocation("Offworld Alley"), 500);
    };
    choicesDiv.appendChild(watchBtn);
}

function serverRoom() {
    clearScreen();
    output.innerHTML += "<p>You infiltrate the server room. Data flashes.</p>";
    adjustMorale(1); adjustIdentity(-1);
    pickup("Offworld Data Key");

    const exitBtn = document.createElement("button");
    exitBtn.innerText = "Exit HQ";
    exitBtn.onclick = () => showLocation("Corporate HQ");
    choicesDiv.appendChild(exitBtn);
}

function confrontReplicant() {
    clearScreen();
    output.innerHTML += "<p>Replicant confronts you. Baseline test begins.</p>";
    adjustMorale(1); adjustIdentity(-2);

    const finishBtn = document.createElement("button");
    finishBtn.innerText = "Finish Encounter";
    finishBtn.onclick = () => ending();
    choicesDiv.appendChild(finishBtn);
}

// ------------------- Ending Function -------------------
function ending() {
    clearScreen();
    let endText = "<p>The neon rain reflects your choices.</p>";

    if (player.identityStability <= 0) {
        endText += "<p>Your mind collapses. Baseline failed. Darkness wins.</p>";
    } else if (player.moraleScore >= 3) {
        endText += "<p>You preserved morality. Memories intact. Identity stable.</p>";
    } else if (player.moraleScore <= -3) {
        endText += "<p>Morale drift consumes you. Memories corrupted. Fade into neon shadow.</p>";
    } else if (player.inventory.includes("Tyrell Note") && player.inventory.includes("Neon Locket") && player.inventory.includes("Hidden Memory")) {
        endText += "<p style='color:#ff77ff;'>Secret Ending: You uncover the lost memories of Rachael Tyrell herself. Neon rain bathes your identity. Truth transcends morality.</p>";
    } else {
        endText += "<p>Ambiguous path. Neon flickers. Identity and morality in balance.</p>";
    }

    output.innerHTML = endText;
    choicesDiv.innerHTML = "";
    statusDiv.innerHTML = "";
}

// ------------------- Main Display -------------------
function showLocation(location) {
    if (player.identityStability <= 0) return ending();

    player.location = location;
    const loc = locations[location];
    clearScreen();

    let text = loc.text;

    // Secret memory path trigger
    if (location === "Offworld Alley" && player.memories.redDream && !player.inventory.includes("Hidden Memory")) {
        text += "<p style='color:#ff00ff;'>A hidden memory flickers, only visible to you.</p>";
        pickup("Hidden Memory");
    }

    output.innerHTML += `<p>${text}</p>`;

    // Render normal choices
    for (const [label, dest] of Object.entries(loc.choices)) {
        const btn = document.createElement("button");
        btn.innerText = label;
        btn.onclick = () => handleChoice(dest);
        choicesDiv.appendChild(btn);
    }

    // Render secret choices
    const secretChoices = checkSecretPaths(location);
    secretChoices.forEach(secret => {
        const btn = document.createElement("button");
        btn.innerText = secret.text;
        btn.style.background = "#ff00ff";
        btn.style.color = "#000";
        btn.onclick = () => handleChoice(secret.dest);
        choicesDiv.appendChild(btn);
    });

    updateStatus();
}

function handleChoice(dest) {
    switch(dest) {
        case "Drone Encounter": droneEncounter(); break;
        case "Memory Trigger": memoryTrigger(); break;
        case "HoloMemory": holoMemory(); break;
        case "Server Room": serverRoom(); break;
        case "Confront Replicant": confrontReplicant(); break;
        default: showLocation(dest); break;
    }
}

// ------------------- Start Game -------------------
showLocation(player.location);
