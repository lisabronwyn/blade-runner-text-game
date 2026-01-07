// ------------------- Player State -------------------
const player = {
    location: "Neon Alley",
    inventory: [],
    memories: {},
    moralScore: 0,
    identityStability: 5
};

// ------------------- Locations -------------------
const locations = {
    "Neon Alley": {
        text: "<p>Rain slicks the pavement. Neon kanji reflects in puddles. Shadows move unseen.</p>",
        choices: {
            "Enter the Noodle Bar": "Noodle Bar",
            "Inspect the Drone": "Drone Encounter",
            "Walk to Offworld Alley": "Offworld Alley"
        }
    },
    "Noodle Bar": {
        text: "<p>Steam fogs the windows. The cook avoids your gaze.</p>",
        choices: {
            "Ask about the Red Dream": "Memory Trigger",
            "Leave quietly": "Neon Alley"
        }
    },
    "Drone Encounter": { text: "", choices: {} },
    "Memory Trigger": { text: "", choices: {} },
    "Offworld Alley": {
        text: "<p>Empty and silent. Flickering holo-ads show fragmented memories.</p>",
        choices: {
            "Investigate the Hologram": "HoloMemory",
            "Return to Neon Alley": "Neon Alley",
            "Enter Corporate HQ": "Corporate HQ"
        }
    },
    "HoloMemory": { text: "", choices: {} },
    "Corporate HQ": {
        text: "<p>Towering glass walls reflect neon rain. Drones patrol silently.</p>",
        choices: {
            "Sneak into Server Room": "Server Room",
            "Confront the Replicant": "Confront Replicant",
            "Return to Offworld Alley": "Offworld Alley"
        }
    },
    "Server Room": { text: "", choices: {} },
    "Confront Replicant": { text: "", choices: {} },
    "Tyrell Note": {
        text: "<p>A handwritten note from Tyrell Corporation: 'Truth is a luxury.'</p>",
        choices: { "Return to Noodle Bar": "Noodle Bar" }
    },
    "Neon Locket": {
        text: "<p>A small locket flickers neon pink. Memories trapped inside.</p>",
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

function adjustIdentity(amount) { player.identityStability = Math.max(0, Math.min(10, player.identityStability + amount)); }
function adjustMoral(amount) { player.moralScore += amount; }

function pickup(item) {
    if (!player.inventory.includes(item)) {
        player.inventory.push(item);
        output.innerHTML += `<p class="pickup">Collected: ${item}</p>`;
        updateStatus();
    }
}

function updateStatus() { statusDiv.innerText = `Identity: ${player.identityStability} | Moral: ${player.moralScore}`; }

// ------------------- Secret Paths -------------------
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

// ------------------- Typewriter -------------------
function typeWriter(text, speed = 25, callback) {
    let i = 0;
    output.innerHTML += ""; // Ensure cleared only at start
    function type() {
        if (i < text.length) {
            output.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    type();
}

// ------------------- Continue Button -------------------
function createContinueButton(label, destination) {
    const btn = document.createElement("button");
    btn.innerText = label;
    btn.onclick = () => {
        if (destination === "ENDING") ending();
        else showLocation(destination);
    };
    choicesDiv.innerHTML = "";
    choicesDiv.appendChild(btn);
}

// ------------------- Event Functions -------------------
function droneEncounter() {
    clearScreen();
    typeWriter("<p>The drone hums, hesitating. Its lens scans your soul.</p>", 25, () => {
        const hackBtn = document.createElement("button");
        hackBtn.innerText = "Hack Drone";
        hackBtn.onclick = () => {
            typeWriter("<p>You uncover forbidden files. Identity shakes.</p>", 25, () => {
                player.memories.droneHack = true;
                adjustIdentity(-1);
                pickup("Encrypted File");
                createContinueButton("Return to Neon Alley", "Neon Alley");
            });
        };
        choicesDiv.appendChild(hackBtn);

        const destroyBtn = document.createElement("button");
        destroyBtn.innerText = "Destroy Drone";
        destroyBtn.onclick = () => {
            typeWriter("<p>Sparks fly. Moral score decreases.</p>", 25, () => {
                adjustMoral(-1);
                createContinueButton("Return to Neon Alley", "Neon Alley");
            });
        };
        choicesDiv.appendChild(destroyBtn);
    });
}

function memoryTrigger() {
    clearScreen();
    player.memories.redDream = true;
    adjustIdentity(-1);
    pickup("Red Dream Fragment");

    typeWriter("<p>The word 'red' echoes inside. Memory integrity shaken.</p>", 25, () => {
        createContinueButton("Return", "Noodle Bar");
    });
}

function holoMemory() {
    clearScreen();
    typeWriter("<p>A hologram flickers: a future that might never exist.</p>", 25, () => {
        const interveneBtn = document.createElement("button");
        interveneBtn.innerText = "Intervene";
        interveneBtn.onclick = () => {
            typeWriter("<p>You alter the memory. Moral rises, identity falters.</p>", 25, () => {
                adjustMoral(1); adjustIdentity(-1);
                pickup("Altered Holo Memory");
                createContinueButton("Return to Offworld Alley", "Offworld Alley");
            });
        };
        choicesDiv.appendChild(interveneBtn);

        const watchBtn = document.createElement("button");
        watchBtn.innerText = "Watch Silently";
        watchBtn.onclick = () => {
            typeWriter("<p>You watch. Moral drifts down.</p>", 25, () => {
                adjustMoral(-1);
                createContinueButton("Return to Offworld Alley", "Offworld Alley");
            });
        };
        choicesDiv.appendChild(watchBtn);
    });
}

function serverRoom() {
    clearScreen();
    typeWriter("<p>You infiltrate the server room. Data flashes.</p>", 25, () => {
        adjustMoral(1); adjustIdentity(-1);
        pickup("Offworld Data Key");
        createContinueButton("Exit HQ", "Corporate HQ");
    });
}

function confrontReplicant() {
    clearScreen();
    typeWriter("<p>Replicant confronts you. Baseline test begins.</p>", 25, () => {
        adjustMoral(1); adjustIdentity(-2);
        createContinueButton("Finish Encounter", "ENDING");
    });
}

// ------------------- Ending -------------------
function ending() {
    clearScreen();
    let endText = "<p>The neon rain reflects your choices.</p>";
    if (player.identityStability <= 0) endText += "<p>Your mind collapses. Baseline failed. Darkness wins.</p>";
    else if (player.moralScore >= 3) endText += "<p>You preserved morality. Memories intact. Identity stable.</p>";
    else if (player.moralScore <= -3) endText += "<p>Moral drift consumes you. Memories corrupted. Fade into neon shadow.</p>";
    else if (player.inventory.includes("Tyrell Note") && player.inventory.includes("Neon Locket") && player.inventory.includes("Hidden Memory"))
        endText += "<p style='color:#ff77ff;'>Secret Ending: You uncover the lost memories of Rachael Tyrell herself. Neon rain bathes your identity. Truth transcends morality.</p>";
    else endText += "<p>Ambiguous path. Neon flickers. Identity and morality in balance.</p>";

    typeWriter(endText, 25);
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

    if (location === "Offworld Alley" && player.memories.redDream && !player.inventory.includes("Hidden Memory")) {
        text += "<p style='color:#ff00ff;'>A hidden memory flickers, only visible to you.</p>";
        pickup("Hidden Memory");
    }

    typeWriter(text, 25);

    // Normal choices
    for (const [label, dest] of Object.entries(loc.choices)) {
        const btn = document.createElement("button");
        btn.innerText = label;
        btn.onclick = () => handleChoice(dest);
        choicesDiv.appendChild(btn);
    }

    // Secret choices
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
