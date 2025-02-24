let numberOfBottles = 100;
let stars = 0;
let lyricsContainer = document.getElementById("lyrics");
let takeOneButton = document.getElementById("takeOne");
let bottleWall = document.getElementById("bottleWall");
let scoreDisplay = document.getElementById("score");
let bottleBreakSound = document.getElementById("bottleBreak");
let cheerSound = document.getElementById("cheer");
let buddyText = document.getElementById("buddyText");

function startGame() {
    numberOfBottles = 100;
    stars = 0;
    lyricsContainer.innerHTML = `<p>Let’s start the magic adventure! 100 green bottles standing on the wall.</p>`;
    takeOneButton.disabled = false;
    renderBottles();
    updateScore();
    wiggleBottles();
    updateBuddy("Yay! Let’s knock down some bottles!");
}

function renderBottles() {
    bottleWall.innerHTML = "";
    for (let i = 0; i < numberOfBottles; i++) {
        let bottle = document.createElement("div");
        bottle.classList.add("bottle");
        bottle.setAttribute("id", `bottle${i}`);
        bottle.addEventListener("click", () => takeOneDown());
        bottleWall.appendChild(bottle);
    }
}

function updateScore() {
    scoreDisplay.textContent = `Bottles Left: ${numberOfBottles} | Stars: ${stars}`;
}

function wiggleBottles() {
    const bottles = document.querySelectorAll(".bottle");
    bottles.forEach(bottle => {
        setInterval(() => {
            if (!bottle.classList.contains("falling")) {
                bottle.style.transform = `translateX(${Math.random() * 15 - 7.5}px) rotate(${Math.random() * 8 - 4}deg)`;
            }
        }, 400);
    });
}

function takeOneDown() {
    if (numberOfBottles > 0) {
        let bottleWord = numberOfBottles === 1 ? "bottle" : "bottles";
        let text = `${numberOfBottles} green ${bottleWord} standing on the wall. ${numberOfBottles} green ${bottleWord} standing on the wall. If one green bottle should accidentally fall down...`;
        numberOfBottles--;
        stars += 1; // Earn a star for each bottle knocked down

        let bottleToFall = document.getElementById(`bottle${numberOfBottles}`);
        if (bottleToFall) {
            bottleToFall.classList.add("falling");
            bottleBreakSound.play();
            setTimeout(() => bottleToFall.remove(), 1200);
        }
        
        bottleWord = numberOfBottles === 1 ? "bottle" : "bottles";
        text += ` ${numberOfBottles} green ${bottleWord} standing on the wall!`;
        lyricsContainer.innerHTML += `<p>${text}</p>`;
        speakLyrics(text);
        updateScore();
        updateBuddy(`Wow! Only ${numberOfBottles} bottles left! Keep going!`);

        if (numberOfBottles === 0) {
            takeOneButton.disabled = true;
            celebrateEnd();
            lyricsContainer.innerHTML += `<p>Yay! No more green bottles standing on the wall! You’re a superstar! 🌟</p>`;
            speakLyrics("Yay! No more green bottles standing on the wall! You’re a superstar!");
        }
    }
}

function speakLyrics(text) {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        let speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 0.85;
        speech.pitch = 1.7;
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

function updateBuddy(message) {
    buddyText.textContent = message;
    buddyText.style.animation = "blink 2s infinite";
    setTimeout(() => buddyText.style.animation = "none", 2000);
}

function celebrateEnd() {
    bottleWall.style.background = "#ffebee";
    bottleWall.style.animation = "celebrate 2s infinite";
    document.body.style.background = "#fff3cd";
    cheerSound.play();
    launchConfetti();
    setTimeout(() => {
        bottleWall.style.background = "none";
        bottleWall.style.animation = "none";
        document.body.style.backgroundImage = "url('/wall.jpeg')";
    }, 6000);
}

function launchConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4d4d', '#ff7f7f', '#fff3cd', '#ffebee']
    });
}

document.addEventListener("DOMContentLoaded", () => {
    wiggleBottles();
    updateBuddy("Hi! Let’s knock down some bottles together!");
});