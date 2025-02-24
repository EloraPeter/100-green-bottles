let numberOfBottles = 100;
let lyricsContainer = document.getElementById("lyrics");
let takeOneButton = document.getElementById("takeOne");
let bottleWall = document.getElementById("bottleWall");
let scoreDisplay = document.getElementById("score");
let bottleBreakSound = document.getElementById("bottleBreak");

function startGame() {
    numberOfBottles = 100;
    lyricsContainer.innerHTML = `<p>Let’s start the adventure! 100 green bottles standing on the wall.</p>`;
    takeOneButton.disabled = false;
    renderBottles();
    updateScore();
    wiggleBottles(); // Add playful movement to bottles
}

function renderBottles() {
    bottleWall.innerHTML = "";
    for (let i = 0; i < numberOfBottles; i++) {
        let bottle = document.createElement("div");
        bottle.classList.add("bottle");
        bottle.setAttribute("id", `bottle${i}`);
        bottle.addEventListener("click", () => takeOneDown()); // Make bottles clickable
        bottleWall.appendChild(bottle);
    }
}

function updateScore() {
    scoreDisplay.textContent = `Bottles Left: ${numberOfBottles}`;
}

function wiggleBottles() {
    const bottles = document.querySelectorAll(".bottle");
    bottles.forEach(bottle => {
        setInterval(() => {
            if (!bottle.classList.contains("falling")) {
                bottle.style.transform = `translateX(${Math.random() * 10 - 5}px) rotate(${Math.random() * 5 - 2.5}deg)`;
            }
        }, 500);
    });
}

function takeOneDown() {
    if (numberOfBottles > 0) {
        let bottleWord = numberOfBottles === 1 ? "bottle" : "bottles";
        let text = `${numberOfBottles} green ${bottleWord} standing on the wall. ${numberOfBottles} green ${bottleWord} standing on the wall. If one green bottle should accidentally fall down...`;
        numberOfBottles--;

        let bottleToFall = document.getElementById(`bottle${numberOfBottles}`);
        if (bottleToFall) {
            bottleToFall.classList.add("falling");
            bottleBreakSound.play(); // Play sound effect
            setTimeout(() => bottleToFall.remove(), 1000);
        }
        
        bottleWord = numberOfBottles === 1 ? "bottle" : "bottles";
        text += ` ${numberOfBottles} green ${bottleWord} standing on the wall!`;
        lyricsContainer.innerHTML += `<p>${text}</p>`;
        speakLyrics(text);
        updateScore();

        if (numberOfBottles === 0) {
            takeOneButton.disabled = true;
            celebrateEnd();
            lyricsContainer.innerHTML += `<p>Yay! No more green bottles standing on the wall! You won the adventure! 🎉</p>`;
            speakLyrics("Yay! No more green bottles standing on the wall! You won the adventure!");
        }
    }
}

function speakLyrics(text) {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        let speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 0.9; // Slower, more playful speech
        speech.pitch = 1.5; // Higher pitch for fun
        speech.volume = 1;

        let voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            speech.voice = voices.find(voice => voice.name.includes("Child") || voice.name.includes("Female")) || voices[0];
        } else {
            speechSynthesis.onvoiceschanged = () => {
                let updatedVoices = speechSynthesis.getVoices();
                speech.voice = updatedVoices.find(voice => voice.name.includes("Child") || voice.name.includes("Female")) || updatedVoices[0];
                speechSynthesis.speak(speech);
            };
        }
        speechSynthesis.speak(speech);
    }
}

function celebrateEnd() {
    bottleWall.style.background = "#ffebee";
    bottleWall.style.animation = "celebrate 2s infinite";
    document.body.style.background = "#fff3cd";
    setTimeout(() => {
        bottleWall.style.background = "none";
        bottleWall.style.animation = "none";
        document.body.style.backgroundImage = "url('wall.jpeg')";
    }, 5000);
}

document.addEventListener("DOMContentLoaded", () => {
    wiggleBottles();
});