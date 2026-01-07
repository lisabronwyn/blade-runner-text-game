// ------------------- Player State -------------------
const player = {
    location: "Neon Alley",
    inventory: [],
    memories: {
        redDream: false,
        offworldPhoto: false,
        heardBaselineFail: false
    },
    moralScore: 0,
    identityStability: 5 // 0 = collapse
};

// ------------------- Locations & Events -------------------
const locations = {
    "Neon Alley": {
        text: "Rain slicks the pavement. Neon kanji reflects in puddles. Someone is watching you.",
        choices: {
            "Enter the noodle bar": "Noodle Bar",
            "Inspect the drone": "Drone Encounter"
        }
    },
    "Noodle Bar": {
        text: "Steam rises inside. The cook avoids your eyes, preoccupied with knives.",
        choices: {
            "Ask about the red dream": "Memory Trigger",
            "Leave quietly": "Neon Alley"
        }
    },
    "Offworld Alley": {
        text: "Empty and silent. A flickering holo-ad flashes a memory you don't recognize.",
        choices: {
            "Investigate the hologram": "HoloMemory",
            "Return to Neon Alley": "Neon Alley"
        }
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
        output.innerHTML += "<p>Sparks fly. Someone across the street flinches. Moral score decreases.</p>";
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
        output.innerHTML += "<p>You alter the memory. Moral score rises, but identity falters.</p>";
        adjustMoral(1);
        adjustIdentity(-1);
        updateStatus();
        setTimeout(() => showLocation("Offworld Alley"), 500);
    };
    choicesDiv.appendChild(interveneBtn);

    const watchBtn = document.createElement("button");
    watchBtn.innerText = "Watch";
    watchBtn.onclick = () => {
        output.innerHTML += "<p>You watch silently. Identity remains, but moral drift decreases.</p>";
        adjustMoral(-1);
        updateStatus();
        setTimeout(() => showLocation("Offworld Alley"), 500);
    };
    choicesDiv.appendChild(watchBtn);
}

// ------------------- Main Display Function -------------------
function showLocation(location) {
    if (player.identityStability <= 0) {
        clearScreen();
        output.innerHTML = "<p>You fail the baseline test. No one is surprised. The neon blurs into darkness.</p>";
        choicesDiv.innerHTML = "";
        return;
    }

    player.location = location;
    const loc = locations[location];
    clearScreen();
    output.innerHTML += `<p>${loc.text}</p>`;

    for (const [text, dest] of Object.entries(loc.choices)) {
        const btn = document.createElement("button");
        btn.innerText = text;
        btn.onclick = () => {
            if (dest === "Drone Encounter") droneEncounter();
            else if (dest === "Memory Trigger") memoryTrigger();
            else if (dest === "HoloMemory") holoMemory();
            else showLocation(dest);
        };
        choicesDiv.appendChild(btn);
    }

    updateStatus();
}

// ------------------- Start Game -------------------
showLocation(player.location);
