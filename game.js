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
    if (typeof amount !== "number") amount = 0; 
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
function typeWriter(text, speed = 50, callback) {  // slower for mobile
    let i = 0;
    const paragraph = document.createElement("p");
    output.appendChild(paragraph);

    function type() {
        if (i < text.length) {
            paragraph.innerText += text.charAt(i);
            i++;
            let delay = speed;
            if (".!?".includes(text.charAt(i-1))) delay += 150;
            setTimeout(type, delay);
        } else if (callback) callback();
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
    typeWriter("The drone hums, hesitating. Its lens scans your soul, waiting for a sign.", 50, () => {
        const hackBtn = document.createElement("button");
        hackBtn.innerText = "Hack Drone";
        hackBtn.onclick = () => {
            typeWriter("You uncover forbidden files. Identity trembles under the weight of knowledge.", 50, () => {
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
            typeWriter("Sparks fly and metal screams. Morale decreases.", 50, () => {
                adjustMorale(-1);
                createContinueButton("Return to Neon Alley", "Neon Alley");
            });
        };
        choicesDiv.appendChild(destroyBtn);
    });
}

// Other events (memoryTrigger, holoMemory, serverRoom, confrontReplicant) remain same
// Replace adjustMoral() → adjustMorale() and speed = 50ms

// ------------------- Main Display -------------------
function showLocation(location) {
    if (player.identityStability <= 0) return ending();
    player.location = location;
    const loc = locations[location];
    clearScreen();

    typeWriter(loc.text, 50);

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

// Start game
showLocation(player.location);
