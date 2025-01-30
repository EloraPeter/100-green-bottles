let numberOfBottles = 100;
let lyricsContainer = document.getElementById("lyrics");
let takeOneButton = document.getElementById("takeOne");
let bottleWall = document.getElementById("bottleWall");

function startGame() {
    numberOfBottles = 100;
    lyricsContainer.innerHTML = "";
    takeOneButton.disabled = false;
    renderBottles();
    updateLyrics();
}

function renderBottles() {
    bottleWall.innerHTML = "";
    for (let i = 0; i < numberOfBottles; i++) {
        let bottle = document.createElement("div");
        bottle.classList.add("bottle");
        bottle.setAttribute("id", `bottle${i}`);
        bottleWall.appendChild(bottle);
    }
}

function updateLyrics() {
    lyricsContainer.innerHTML = `<p>${numberOfBottles} green bottles standing on the wall.</p>`;
}

function takeOneDown() {
    if (numberOfBottles > 0) {
        let bottleWord = numberOfBottles === 1 ? "bottle" : "bottles";
        let text = `${numberOfBottles} green ${bottleWord} standing on the wall. ${numberOfBottles} green ${bottleWord} standing on the wall . if one green bottle should accidently fall down.`;
        numberOfBottles--;

        let bottleToFall = document.getElementById(`bottle${numberOfBottles}`);
        if (bottleToFall) {
            bottleToFall.classList.add("falling");
            setTimeout(() => bottleToFall.remove(), 1000);
        }
        
        bottleWord = numberOfBottles === 1 ? "bottle" : "bottles";
        text += ` ${numberOfBottles} green ${bottleWord} standing on the wall.`;

        lyricsContainer.innerHTML += `<p>${text}</p>`;
        speakLyrics(text);

        if (numberOfBottles === 0) {
            takeOneButton.disabled = true;
            lyricsContainer.innerHTML += `<p>No more green bottles standing on the wall!</p>`;
            speakLyrics("No more green bottles standing on the wall!");
        }
    }
}


function speakLyrics(text) {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel(); // Stop any ongoing speech
        let speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1;

        // Ensure voices are loaded
        let voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            speech.voice = voices[0]; // Use the first available voice
        } else {
            speechSynthesis.onvoiceschanged = () => {
                let updatedVoices = speechSynthesis.getVoices();
                if (updatedVoices.length > 0) {
                    speech.voice = updatedVoices[0];
                    speechSynthesis.speak(speech);
                }
            };
        }
        speechSynthesis.speak(speech);
    } else {
        console.error("Speech synthesis not supported in this browser.");
    }
}
