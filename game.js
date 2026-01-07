// ------------------- Player State -------------------
const player = {
    location: "Neon Alley",
    inventory: [],
    memories: {
        redDream: false,
        offworldPhoto: false,
        heardBaselineFail: false,
        hologramAltered: false
    },
    moralScore: 0,
    identityStability: 5 // 0 = collapse
};

// ------------------- Locations & Events -------------------
const locations = {
    "Neon Alley": {
        text: "Rain slicks the pavement. Neon kanji reflects in puddles. Someone watches you from the shadows.",
        choices: {
            "Enter the noodle bar": "Noodle Bar",
            "Inspect the drone": "Drone Encounter",
            "Walk to the offworld alley": "Offworld Alley"
        }
    },
    "Noodle Bar": {
        text: "Steam fogs the windows. The cook avoids your gaze, knife in hand.",
        choices: {
            "Ask about the red dream": "Memory Trigger",
            "Leave quietly": "Neon Alley"
        }
    },
    "Drone Encounter": {
        text: "",
        choices: {}
    },
    "Memory Trigger": {
        text: "",
        choices: {}
    },
    "Offworld Alley": {
        text: "Empty and silent. Flickering holo-ads show memories you don't remember.",
        choices: {
            "Investigate the hologram": "HoloMemory",
            "Return to Neon Alley": "Neon Alley"
        }
    },
    "HoloMemory": {
        text: "",
        choices: {}
    },
    "Corporate HQ": {
        text: "Towering glass walls reflect the rain. Security drones patrol the floors.",
        choices: {
            "Sneak into server room": "Server Room",
            "Confront the Replicant": "Confront Replicant",
            "Return to Offworld Alley": "Offworld Alley"
        }
    },
    "Server Room": {
        text: "",
        choices: {}
    },
    "Confront Replicant": {
        text: "",
        choices: {}
    }
};

// ------------------- DOM References -------------------
const output = document.getElementById("output");
const choicesDiv = document.getElementById("choices");
const statusDiv = document.getElementById("status");

// ------------------- Utility Functions -------------------
function clearScreen() {
    output.innerHTML = "";
    choicesDiv.innerHTML = "";
}

function adjustIdentity(amount) {
    player.identityStability += amount;
    player.identityStability = Math.max(0, Math.min(10, player.identityStability));
}

function adjustMoral(amount) {
    player.moralScore += amount;
}

function updateStatus() {
    statusDiv.innerText = `Identity: ${player.identityStability} | Moral: ${player.moralScore}`;
}

// ------------------- Event Handlers -------------------
function droneEncounter() {
    clearScreen();
    output.innerHTML += "<p>The drone hovers, scanning. Its lens dilates, hesitating to classify you.</p>";

    const hackBtn = document.createElement("button");
    hackBtn.innerText = "Hack it";
    hackBtn.onclick = () => {
        output.innerHTML += "<p>You access files: SUBJECT REMEMBERS RAIN WRONG. Identity destabilized.</p>";
        player.memories.heardBaselineFail = true;
        adjustIdentity(-1);
        updateStatus();
        setTimeout(() => showLocation("Neon Alley"), 500);
    };
    choicesDiv.appendChild(hackBtn);

    const destroyBtn = document.createElement("button");
    destroyBtn.innerText = "Destroy it";
    destroyBtn.onclick = () => {
        output.innerHTML += "<p>Sparks fly. Moral score decreases.</p>";
        adjustMoral(-1);
        updateStatus();
        setTimeout(() => showLocation("Neon Alley"), 500);
    };
    choicesDiv.appendChild(destroyBtn);
}

function memoryTrigger() {
    clearScreen();
    output.innerHTML += "<p>The word 'red' echoes inside your mind. Memory integrity shaken.</p>";
    player.memories.redDream = true;
    adjustIdentity(-1);
    updateStatus();

    const continueBtn = document.createElement("button");
    continueBtn.innerText = "Return";
    continueBtn.onclick = () => showLocation("Noodle Bar");
    choicesDiv.appendChild(continueBtn);
}

function holoMemory() {
    clearScreen();
    output.innerHTML += "<p>A holographic memory flickers, showing a future you may never have. Do you intervene or watch?</p>";

    const interveneBtn = document.createElement("button");
    interveneBtn.innerText = "Intervene";
    interveneBtn.onclick = () => {
        output.innerHTML += "<p>You alter the memory. Moral score rises, identity falters.</p>";
        player.memories.hologramAltered = true;
        adjustMoral(1);
        adjustIdentity(-1);
        updateStatus();
        setTimeout(() => showLocation("Offworld Alley"), 500);
    };
    choicesDiv.appendChild(interveneBtn);

    const watchBtn = document.createElement("button");
    watchBtn.innerText = "Watch";
    watchBtn.onclick = () => {
        output.innerHTML += "<p>You watch silently. Identity stable, but moral drifts down.</p>";
        adjustMoral(-1);
        updateStatus();
        setTimeout(() => showLocation("Offworld Alley"), 500);
    };
    choicesDiv.appendChild(watchBtn);
}

function serverRoom() {
    clearScreen();
    output.innerHTML += "<p>You infiltrate the server room. Data flashes: offworld memories, hidden files.</p>";
    adjustMoral(1);
    adjustIdentity(-1);
    updateStatus();

    const exitBtn = document.createElement("button");
    exitBtn.innerText = "Exit HQ";
    exitBtn.onclick = () => showLocation("Corporate HQ");
    choicesDiv.appendChild(exitBtn);
}

function confrontReplicant() {
    clearScreen();
    output.innerHTML += "<p>You confront the replicant. Identity test begins. Moral choices weigh heavy.</p>";
    adjustMoral(1);
    adjustIdentity(-2);
    updateStatus();

    const finishBtn = document.createElement("button");
    finishBtn.innerText = "Finish";
    finishBtn.onclick = () => ending();
    choicesDiv.appendChild(finishBtn);
}

// ------------------- Ending Logic -------------------
function ending() {
    clearScreen();
    let endText = "<p>The rain falls as your story concludes.</p>";

    if (player.identityStability <= 0) {
        endText += "<p>You failed the baseline. The neon dissolves into darkness. A tragic end.</p>";
    } else if (player.moralScore >= 2) {
        endText += "<p>Your choices preserved morality. Some memories are safe. Identity holds.</p>";
    } else if (player.moralScore <= -2) {
        endText += "<p>Your moral drift consumed you. Memories corrupted, you fade into anonymity.</p>";
    } else {
        endText += "<p>Your path remains ambiguous. Identity fluctuates, moral lines blur. Neon continues to rain.</p>";
    }

    output.innerHTML = endText;
    choicesDiv.innerHTML = "";
    statusDiv.innerHTML = "";
}

// ------------------- Main Display Function -------------------
function showLocation(location) {
    if (player.identityStability <= 0) {
        ending();
        return;
    }

    player.location = location;
    const loc = locations[location];
    clearScreen();

    if (loc.text) output.innerHTML += `<p>${loc.text}</p>`;

    for (const [text, dest] of Object.entries(loc.choices)) {
        const btn = document.createElement("button");
        btn.innerText = text;
        btn.onclick = () => {
            switch(dest) {
                case "Drone Encounter": droneEncounter(); break;
                case "Memory Trigger": memoryTrigger(); break;
                case "HoloMemory": holoMemory(); break;
                case "Server Room": serverRoom(); break;
                case "Confront Replicant": confrontReplicant(); break;
                default: showLocation(dest); break;
            }
        };
        choicesDiv.appendChild(btn);
    }

    updateStatus();
}

// ------------------- Start Game -------------------
showLocation(player.location);
