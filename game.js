// Only the start to test the box and typewriter
const output = document.getElementById("output");
const choicesDiv = document.getElementById("choices");
const statusDiv = document.getElementById("status");

function clearScreen() {
    output.innerHTML = "";
    choicesDiv.innerHTML = "";
}

function typeWriter(text, speed = 25, callback) {
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

// Test message
clearScreen();
typeWriter("Rain slicks the pavement. Neon kanji reflects in puddles. Shadows move unseen.", 30);
