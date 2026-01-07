from js import document

output = document.getElementById("output")
choices_div = document.getElementById("choices")

player = {
    "location": "Neon Alley",
    "identity": 5
}

locations = {
    "Neon Alley": {
        "text": "Rain slicks the pavement. Neon bleeds into the dark.",
        "choices": {
            "Enter the noodle bar": "Noodle Bar",
            "Inspect the drone": "Drone"
        }
    },
    "Noodle Bar": {
        "text": "Steam rises. The cook avoids your eyes.",
        "choices": {
            "Return to the alley": "Neon Alley"
        }
    }
}

def clear_screen():
    output.innerHTML = ""
    choices_div.innerHTML = ""

def show_location():
    clear_screen()
    loc = locations[player["location"]]
    output.innerHTML += f"<p>{loc['text']}</p>"

    for text, dest in loc["choices"].items():
        btn = document.createElement("button")
        btn.innerText = text
        btn.onclick = lambda e, d=dest: move(d)
        choices_div.appendChild(btn)

def move(destination):
    if destination == "Drone":
        drone_event()
    else:
        player["location"] = destination
        show_location()

def drone_event():
    clear_screen()
    output.innerHTML += "<p>The drone hesitates. You are not classified.</p>"
    player["identity"] -= 1

    btn = document.createElement("button")
    btn.innerText = "Return to alley"
    btn.onclick = lambda e: show_location()
    choices_div.appendChild(btn)

show_location()
