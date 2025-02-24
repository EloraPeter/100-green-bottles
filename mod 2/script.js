let currentLevel = 1;
let numberOfBottles = 100;
let stars = 0;
let lyricsContainer = document.getElementById("lyrics");
let takeOneButton = document.getElementById("takeOne");
let bottleWall = document.getElementById("bottleWall");
let scoreDisplay = document.getElementById("score");
let bottleBreakSound = document.getElementById("bottleBreak");
let cheerSound = document.getElementById("cheer");
let buddyText = document.getElementById("buddyText");
let gameArea = document.getElementById("gameArea");
let progressBar = document.getElementById("progressBar");
let currentStarsDisplay = document.getElementById("stars");

function startLevel(level) {
    currentLevel = level;
    stars = 0; // Reset stars for new level
    numberOfBottles = 100; // Reset for Level 1, adjust for others
    document.getElementById("currentLevel").textContent = currentLevel;
    takeOneButton.disabled = false;
    gameArea.style.display = "none";
    bottleWall.style.display = "block";
    lyricsContainer.innerHTML = "";
    updateScore();
    updateProgress();
    switch (level) {
        case 1:
            startBottleKnock();
            break;
        case 2:
            startBottleStack();
            break;
        case 3:
            startBottleCatch();
            break;
        case 4:
            startBottlePuzzle();
            break;
    }
    updateBuddy(`Level ${level} started! Let’s have fun!`);
}

function updateProgress() {
    const maxStars = 100 * currentLevel; // Example: 100 stars per level to reach next
    const progress = (stars / maxStars) * 100;
    progressBar.value = progress;
}

function updateScore() {
    scoreDisplay.textContent = `Bottles Left: ${numberOfBottles} | Stars: ${stars}`;
    currentStarsDisplay.textContent = stars;
}

function updateBuddy(message) {
    buddyText.textContent = message;
    buddyText.style.animation = "blink 2s infinite";
    setTimeout(() => buddyText.style.animation = "none", 2000);
}

// Level 1: Bottle Knock (Existing Game)
function startBottleKnock() {
    bottleWall.style.display = "block";
    renderBottles();
    wiggleBottles();
    lyricsContainer.innerHTML = `<p>Let’s start the magic adventure! 100 green bottles standing on the wall.</p>`;
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
    if (numberOfBottles > 0 && currentLevel === 1) {
        let bottleWord = numberOfBottles === 1 ? "bottle" : "bottles";
        let text = `${numberOfBottles} green ${bottleWord} standing on the wall. ${numberOfBottles} green ${bottleWord} standing on the wall. If one green bottle should accidentally fall down...`;
        numberOfBottles--;
        stars += 5; // Earn 5 stars per bottle

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
        updateProgress();
        updateBuddy(`Wow! Only ${numberOfBottles} bottles left!`);

        if (numberOfBottles === 0) {
            takeOneButton.disabled = true;
            celebrateEnd();
            lyricsContainer.innerHTML += `<p>Yay! No more green bottles standing on the wall! You’re a superstar! 🌟</p>`;
            speakLyrics("Yay! No more green bottles standing on the wall! You’re a superstar!");
            checkLevelProgress();
        }
    }
}

// Level 2: Bottle Stack Challenge
function startBottleStack() {
    bottleWall.style.display = "none";
    gameArea.style.display = "block";
    gameArea.innerHTML = `<h2>Stack Bottles to 10!</h2><div class="bottle-stack" id="stackArea"></div><button onclick="stackBottle()">Add Bottle</button>`;
    numberOfBottles = 0; // Reset for stacking
    stars = 0;
    updateScore();
}

function stackBottle() {
    if (numberOfBottles < 10) {
        let stackArea = document.getElementById("stackArea");
        let bottle = document.createElement("div");
        bottle.classList.add("stack-bottle");
        bottle.style.transform = `translateX(${Math.random() * 20 - 10}px)`;
        stackArea.appendChild(bottle);
        numberOfBottles++;
        stars += 2;
        updateScore();
        updateProgress();
        updateBuddy(`Great stack! ${numberOfBottles} bottles high!`);
        if (numberOfBottles === 10) {
            gameArea.innerHTML += `<p>Yay! You stacked 10 bottles! 🎉</p>`;
            speakLyrics("Yay! You stacked 10 bottles!");
            celebrateEnd();
            checkLevelProgress();
        }
    } else {
        updateBuddy("Oops! You toppled the stack! Try again!");
        gameArea.innerHTML = `<h2>Stack Bottles to 10!</h2><div class="bottle-stack" id="stackArea"></div><button onclick="stackBottle()">Add Bottle</button>`;
        numberOfBottles = 0;
        stars -= 5; // Penalty for failing
        if (stars < 0) stars = 0;
        updateScore();
        updateProgress();
    }
}

// Level 3: Bottle Catch Game
function startBottleCatch() {
    bottleWall.style.display = "none";
    gameArea.style.display = "block";
    gameArea.innerHTML = `<h2>Catch the Falling Bottles!</h2><div class="bottle-catch" id="catchArea"><div class="basket" id="basket"></div></div>`;
    let catchArea = document.getElementById("catchArea");
    let basket = document.getElementById("basket");
    let basketX = 0;

    // Move basket with mouse or touch
    catchArea.addEventListener("mousemove", (e) => {
        basketX = e.clientX - catchArea.offsetLeft - basket.offsetWidth / 2;
        if (basketX < 0) basketX = 0;
        if (basketX > catchArea.offsetWidth - basket.offsetWidth) basketX = catchArea.offsetWidth - basket.offsetWidth;
        basket.style.left = `${basketX}px`;
    });

    // Drop bottles
    function dropBottle() {
        if (stars < 50) { // Limit to 50 stars max for this level
            let bottle = document.createElement("div");
            bottle.classList.add("catch-bottle");
            bottle.style.left = `${Math.random() * (catchArea.offsetWidth - 50)}px`;
            bottle.style.top = "-50px";
            catchArea.appendChild(bottle);

            let fall = setInterval(() => {
                let top = parseInt(bottle.style.top) || 0;
                bottle.style.top = `${top + 5}px`;
                if (top > catchArea.offsetHeight - 50) {
                    clearInterval(fall);
                    bottle.remove();
                    stars -= 2; // Penalty for missing
                    if (stars < 0) stars = 0;
                    updateScore();
                    updateProgress();
                    updateBuddy("Oops! Missed a bottle!");
                }
                if (isColliding(bottle, basket)) {
                    clearInterval(fall);
                    bottle.remove();
                    stars += 5;
                    updateScore();
                    updateProgress();
                    updateBuddy("Great catch! Keep it up!");
                }
            }, 30);
        } else {
            gameArea.innerHTML += `<p>Yay! You caught enough bottles! 🎉</p>`;
            speakLyrics("Yay! You caught enough bottles!");
            celebrateEnd();
            checkLevelProgress();
        }
    }

    setInterval(dropBottle, 2000); // Drop a bottle every 2 seconds
}

function isColliding(bottle, basket) {
    const bottleRect = bottle.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();
    return !(
        bottleRect.bottom < basketRect.top ||
        bottleRect.top > basketRect.bottom ||
        bottleRect.right < basketRect.left ||
        bottleRect.left > basketRect.right
    );
}

// Level 4: Bottle Puzzle
function startBottlePuzzle() {
    bottleWall.style.display = "none";
    gameArea.style.display = "block";
    gameArea.innerHTML = `<h2>Solve the Bottle Puzzle!</h2><div class="bottle-puzzle" id="puzzleArea"></div>`;
    createPuzzle();
}

function createPuzzle() {
    const puzzlePieces = 4; // Simple 2x2 puzzle
    const puzzleArea = document.getElementById("puzzleArea");
    for (let i = 0; i < puzzlePieces; i++) {
        let piece = document.createElement("div");
        piece.classList.add("puzzle-piece");
        piece.style.background = `url('/bottle-removebg-preview.png') no-repeat center/contain`;
        piece.style.width = "100px";
        piece.style.height = "100px";
        piece.style.position = "absolute";
        piece.style.left = `${Math.random() * 300}px`;
        piece.style.top = `${Math.random() * 200}px`;
        piece.draggable = true;
        piece.addEventListener("dragstart", dragStart);
        piece.addEventListener("dragover", dragOver);
        piece.addEventListener("drop", drop);
        puzzleArea.appendChild(piece);
    }
    puzzleArea.addEventListener("dragover", dragOver);
    puzzleArea.addEventListener("drop", drop);
}

let draggedPiece = null;

function dragStart(e) {
    draggedPiece = e.target;
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    if (draggedPiece && e.target.classList.contains("puzzle-piece")) {
        const rect = e.target.getBoundingClientRect();
        draggedPiece.style.left = `${e.clientX - rect.left}px`;
        draggedPiece.style.top = `${e.clientY - rect.top}px`;
    }
    checkPuzzleComplete();
}

function checkPuzzleComplete() {
    const pieces = document.querySelectorAll(".puzzle-piece");
    let complete = true;
    pieces.forEach(piece => {
        const rect = piece.getBoundingClientRect();
        if (rect.left < 100 || rect.left > 300 || rect.top < 100 || rect.top > 300) {
            complete = false;
        }
    });
    if (complete) {
        stars += 20;
        gameArea.innerHTML += `<p>Yay! Puzzle solved! 🎉</p>`;
        speakLyrics("Yay! Puzzle solved!");
        celebrateEnd();
        checkLevelProgress();
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
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4d4d', '#ff7f7f', '#fff3cd', '#ffebee']
    });
}

function checkLevelProgress() {
    if (stars >= 100 * currentLevel) { // Example: 100 stars per level to progress
        currentLevel++;
        if (currentLevel <= 4) {
            updateBuddy(`Wow! You unlocked Level ${currentLevel}!`);
            setTimeout(() => startLevel(currentLevel), 2000);
        } else {
            updateBuddy(`You’re a Bottle Master! 🎉 Play again for more fun!`);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    startLevel(1);
    updateBuddy("Hi! Let’s start our bottle adventure!");
});