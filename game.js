// ------------------- Player State -------------------
const player = {
    location: "Neon Alley",
    inventory: [],
    memories: {},
    morale: 0,                // renamed from moralScore
    identityStability: 5
};

// ------------------- Locations -------------------
const locations = {
    "Neon Alley": {
        text: "Rain slicks the pavement. Neon kanji reflects in puddles. Shadows move unseen along the alley walls.",
        choices: {
            "Enter the Noodle Bar": "Noodle Bar",
            "Inspect the Drone": "Drone Encounter",
            "Walk to Offworld Alley": "Offworld Alley"
        }
    },
    "Noodle Bar": {
        text: "Steam curls from the noodle pots, fogging the windows. The cook avoids your gaze, knife clattering softly.",
        choices: {
            "Ask about the Red Dream": "Memory Trigger",
            "Leave quietly": "Neon Alley"
        }
    },
    "Offworld Alley": {
        text: "The alley is empty, silent except for the hum of flickering holo-ads. Fragments of memories shimmer across the wet walls.",
        choices: {
            "Investigate the Hologram": "HoloMemory",
            "Return to Neon Alley": "Neon Alley",
            "Enter Corporate HQ": "Corporate HQ"
        }
    },
    "Corporate HQ": {
        text: "Towering glass walls reflect the neon rain. Drones patrol silently, lenses scanning for anomalies.",
        choices: {
            "Sneak into Server Room": "Server Room",
            "Confront the Replicant": "Confront Replicant",
            "Return to Offworld Alley": "Offworld Alley"
        }
    },
    "Tyrell Note": {
        text: "A handwritten note from Tyrell Corporation lies folded: 'Truth is a luxury, and memories are fragile.'",
        choices: { "Return to Noodle Bar": "Noodle Bar" }
    },
    "Neon Locket": {
        text: "A small locket glows neon pink, its surface humming with trapped memories. You feel its pulse echo in your mind.",
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
    if (typeof amount !== "number") amount = 0;  // safety
    player.morale += amount; 
}

function pickup(item) {
    if (!player.inventory.includes(item)) {
        player.inventory.push(item);
        const pickupLine = document.createElement("p");
        pickupLine.className = "pickup";
        pickupLine.innerText = `Collected: ${item}`;
        output.appendChild(pickupLine);
        updateStatus();
    }
}

function updateStatus() { 
    statusDiv.innerText = `Identity: ${player.identityStability} | Morale: ${player.morale}`;
}

// ------------------- Typewriter -------------------
function typeWriter(text, speed = 40, callback) {
    let i = 0;
    const paragraph = document.createElement("p");
    output.appendChild(paragraph);

    function type() {
        if (i < text.length) {
            paragraph.innerText += text.charAt(i);
            i++;
            let delay = speed;
            if (".!?".includes(text.charAt(i-1))) delay += 120;
            setTimeout(type, delay);
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
    typeWriter("The drone hums, hesitating. Its lens scans your soul, waiting for a sign.", 25, () => {
        const hackBtn = document.createElement("button");
        hackBtn.innerText = "Hack Drone";
        hackBtn.onclick = () => {
            typeWriter("You uncover forbidden files. Identity trembles under the weight of knowledge.", 25, () => {
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
            typeWriter("Sparks fly and metal screams. Morale decreases.", 25, () => {
                adjustMorale(-1);
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
    typeWriter("The word 'red' echoes inside. Memory integrity shakes.", 25, () => {
        createContinueButton("Return", "Noodle Bar");
    });
}

function holoMemory() {
    clearScreen();
    typeWriter("A hologram flickers: a possible future, shimmering in fractured light.", 25, () => {
        const interveneBtn = document.createElement("button");
        interveneBtn.innerText = "Intervene";
        interveneBtn.onclick = () => {
            typeWriter("You alter the memory. Morale rises, identity falters.", 25, () => {
                adjustMorale(1); adjustIdentity(-1);
                pickup("Altered Holo Memory");
                createContinueButton("Return to Offworld Alley", "Offworld Alley");
            });
        };
        choicesDiv.appendChild(interveneBtn);

        const watchBtn = document.createElement("button");
        watchBtn.innerText = "Watch Silently";
        watchBtn.onclick = () => {
            typeWriter("You watch. Morale drifts down with the neon shadows.", 25, () => {
                adjustMorale(-1);
                createContinueButton("Return to Offworld Alley", "Offworld Alley");
            });
        };
        choicesDiv.appendChild(watchBtn);
    });
}

function serverRoom() {
    clearScreen();
    typeWriter("You infiltrate the server room. Data flashes across holo-screens in chaotic rhythm.", 25, () => {
        adjustMorale(1); adjustIdentity(-1);
        pickup("Offworld Data Key");
        createContinueButton("Exit HQ", "Corporate HQ");
    });
}

function confrontReplicant() {
    clearScreen();
    typeWriter("The Replicant confronts you. Baseline test begins, your pulse quickens.", 25, () => {
        adjustMorale(1); adjustIdentity(-2);
        createContinueButton("Finish Encounter", "ENDING");
    });
}

// ------------------- Ending -------------------
function ending() {
    clearScreen();
    let endText = "The neon rain reflects your choices.";
    if (player.identityStability <= 0) endText += "\nYour mind collapses. Baseline failed. Darkness wins.";
    else if (player.morale >= 3) endText += "\nYou preserved morale. Memories intact. Identity stable.";
    else if (player.morale <= -3) endText += "\nMorale drift consumes you. Memories corrupted. Fade into neon shadow.";
    else if (player.inventory.includes("Tyrell Note") && player.inventory.includes("Neon Locket") && player.inventory.includes("Hidden Memory"))
        endText += "\nSecret Ending: You uncover the lost memories of Rachael Tyrell herself. Neon rain bathes your identity. Truth transcends morality.";
    else endText += "\nAmbiguous path. Neon flickers. Identity and morale in balance.";

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

    typeWriter(loc.text, 25);

    // Secret memory in Offworld Alley
    if (location === "Offworld Alley" && player.memories.redDream && !player.inventory.includes("Hidden Memory")) {
        pickup("Hidden Memory");
        const secretText = document.createElement("p");
        secretText.style.color = "#ff00ff";
        secretText.innerText = "A hidden memory flickers, only visible to you.";
        output.appendChild(secretText);
    }

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
