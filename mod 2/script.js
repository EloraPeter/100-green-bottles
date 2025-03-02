// Initialize variables
let currentLevel = 1;
let numberOfBottles = 0; // Reset for each level as needed
let stars = 0;
let completedLevels = [1]; // Track completed levels (start with Level 1 complete)
let bottleBreakSound = document.getElementById("bottleBreak");
let cheerSound = document.getElementById("cheer");

// DOM elements
let lyricsContainer = document.getElementById("lyrics");
let takeOneButton = document.getElementById("takeOne");
let bottleWall = document.getElementById("bottleWall");
let scoreDisplay = document.getElementById("score");
let buddyText = document.getElementById("buddyText");
let gameArea = document.getElementById("gameArea");
let progressBar = document.getElementById("progressBar");
let currentLevelDisplay = document.getElementById("currentLevel");
let currentStarsDisplay = document.getElementById("stars");
let levelButtons = {
    1: document.getElementById("level1Btn"),
    2: document.getElementById("level2Btn"),
    3: document.getElementById("level3Btn"),
    4: document.getElementById("level4Btn")
};
let nextLevelButton = document.getElementById("nextLevel");
let viewLevelsButton = document.getElementById("viewLevels");
let levelSelector = document.getElementById("levelSelector");

// Event Listeners
viewLevelsButton.addEventListener("click", showLevels);
document.querySelector("#levelSelector button:last-child").addEventListener("click", hideLevels);

function startLevel(level) {
    if (!completedLevels.includes(level)) {
        updateBuddy("Oops! You need to complete the previous level first! 🔒");
        return;
    }
    currentLevel = level;
    numberOfBottles = 100; // Reset for Level 1, adjust for others
    stars = 0; // Reset stars for new level
    currentLevelDisplay.textContent = currentLevel;
    takeOneButton.disabled = false;
    gameArea.classList.add("hidden");
    bottleWall.classList.remove("hidden");
    lyricsContainer.innerHTML = "";
    nextLevelButton.classList.add("hidden"); // Hide next level button when starting a level
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
    const maxStars = 100 * currentLevel; // Example: 100 stars per level to progress
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

// Level View with Padlocks
function showLevels() {
    levelSelector.classList.remove("hidden");
    for (let i = 1; i <= 4; i++) {
        levelButtons[i].classList.remove("locked");
        if (!completedLevels.includes(i)) {
            levelButtons[i].classList.add("locked");
            levelButtons[i].disabled = true;
        } else {
            levelButtons[i].disabled = false;
            levelButtons[i].onclick = () => {
                startLevel(i);
                hideLevels();
            };
        }
    }
}

function hideLevels() {
    levelSelector.classList.add("hidden");
}

// Level 1: Bottle Knock (10x10 Grid Arrangement)
function startBottleKnock() {
    bottleWall.classList.remove("hidden");
    renderBottles();
    wiggleBottles();
    lyricsContainer.innerHTML = `<p>Let’s start the magic adventure! 100 green bottles standing on the wall.</p>`;
}

function renderBottles() {
    bottleWall.innerHTML = "";
    for (let i = 0; i < 100; i++) { // 100 bottles in a 10x10 grid
        let bottle = document.createElement("div");
        bottle.classList.add("bottle");
        bottle.setAttribute("id", `bottle${i}`);
        bottle.addEventListener("click", () => takeOneDown());
        bottleWall.appendChild(bottle);
    }
    // Ensure 10x10 grid by adjusting CSS positioning
    const bottles = document.querySelectorAll(".bottle");
    bottles.forEach((bottle, index) => {
        const row = Math.floor(index / 10);
        const col = index % 10;
        bottle.style.gridRow = row + 1;
        bottle.style.gridColumn = col + 1;
    });
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
        stars += 5;

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
            showNextLevelButton();
        }
    }
}

// Level 2: Bottle Stack (Pyramid Drag-and-Drop, 5 Base to 1 Top)
function startBottleStack() {
    console.log("Starting Bottle Stack game");
    bottleWall.classList.add("hidden");
    gameArea.classList.remove("hidden");
    lyricsContainer.classList.add("hidden");
    takeOneButton.classList.add("hidden");
    gameArea.innerHTML = `<h2>Build a Bottle Pyramid (5 at Base, 1 at Top)!</h2><div class="bottle-stack" id="stackArea"></div>`;
    numberOfBottles = 0; // Reset for stacking
    stars = 0;
    updateScore();
    createStackBottles();
    createDropZones(); // Add this function to show hints
}

function createDropZones() {
    const stackArea = document.getElementById("stackArea");
    const baseX = 120; // Starting x-position of the base row
    const baseY = 350; // Bottom-most row (y-position)
    const bottleSpacing = 100; // Space between bottles

    const positions = [
        { y: baseY, count: 5 },  // Base row (5 bottles)
        { y: baseY - 100, count: 4 },  // Row 2 (4 bottles)
        { y: baseY - 200, count: 3 }, // Row 3 (3 bottles)
        { y: baseY - 300, count: 2 }, // Row 4 (2 bottles)
        { y: baseY - 400, count: 1 }  // Top row (1 bottle)
    ];

    positions.forEach((row, rowIndex) => {
        let startX = baseX + (rowIndex * (bottleSpacing / 2)); // Center each row

        for (let i = 0; i < row.count; i++) {
            let hint = document.createElement("div");
            hint.classList.add("drop-hint");
            hint.style.left = `${startX + i * bottleSpacing}px`;
            hint.style.top = `${row.y}px`;
            hint.setAttribute("data-row", rowIndex); // Mark row for checking
            stackArea.appendChild(hint);
        }
    });
}


function createStackBottles() {
    const stackArea = document.getElementById("stackArea");
    stackArea.innerHTML = "";
    for (let i = 0; i < 15; i++) { // 15 bottles to drag (more than needed for pyramid)
        let bottle = document.createElement("div");
        bottle.classList.add("stack-bottle");
        bottle.id = `bottle-${i}`; // Assign unique ID
        bottle.draggable = true;
        bottle.style.position = "absolute"; // Required for drag-drop positioning
        bottle.addEventListener("dragstart", dragStart);
        bottle.addEventListener("dragover", dragOver);
        bottle.addEventListener("drop", drop);
        stackArea.appendChild(bottle);
    }
    stackArea.addEventListener("dragover", dragOver);
    stackArea.addEventListener("drop", drop);
}

let draggedBottle = null;

function dragStart(e) {
    draggedBottle = e.target;
    e.dataTransfer.setData("text/plain", e.target.id);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    if (draggedBottle) {
        const hints = document.querySelectorAll(".drop-hint");
        let closestHint = null;
        let minDistance = Infinity;

        hints.forEach(hint => {
            let dx = parseInt(hint.style.left) - e.clientX;
            let dy = parseInt(hint.style.top) - e.clientY;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < minDistance) {
                minDistance = distance;
                closestHint = hint;
            }
        });

        // Snap bottle only if it's near a hint (within 50px)
        if (closestHint && minDistance < 50) { 
            draggedBottle.style.left = closestHint.style.left;
            draggedBottle.style.top = closestHint.style.top;
            draggedBottle.setAttribute("data-row", closestHint.getAttribute("data-row")); // Mark its row
            draggedBottle.classList.add("placed");

            setTimeout(() => {
                draggedBottle.classList.remove("placed"); // Remove effect
            }, 500);
            
            playSnapSound(); // Play sound when placed
            checkPyramidComplete(); // Check if the structure is done
        }
    }
}


// function drop(e) {
//     e.preventDefault();
//     if (draggedBottle) {
//         const id = e.dataTransfer.getData("text/plain");
//         const bottle = document.getElementById(id);
//         const rect = e.target.getBoundingClientRect();
//         const x = e.clientX - rect.left - 25; // Center bottle
//         const y = e.clientY - rect.top - 50;
//         bottle.style.left = `${x}px`;
//         bottle.style.top = `${y}px`;
//         checkPyramidComplete();
//     }
// }

function playSnapSound() {
    let audio = new Audio('snap.mp3'); // Add a soft snap sound
    audio.play();
}

function checkPyramidComplete() {
    const bottles = document.querySelectorAll(".stack-bottle");
    let rowCounts = Array(5).fill(0); // Track bottles per row

    bottles.forEach(bottle => {
        let row = bottle.getAttribute("data-row");
        if (row !== null) {
            rowCounts[row]++;
        }
    });

    // Correct bottle counts for each row in pyramid
    const correctRowCounts = [5, 4, 3, 2, 1];

    let correct = rowCounts.every((count, index) => count === correctRowCounts[index]);

    if (correct) { 
        stars += 30;
        gameArea.innerHTML += `<p>Yay! You built a perfect pyramid! 🎉</p>`;
        speakLyrics("Yay! You built a perfect pyramid!");
        celebrateEnd();
        showNextLevelButton();
    }
}


// function checkPyramidComplete() {
//     const bottles = document.querySelectorAll(".stack-bottle");
//     const positions = [
//         { x: 150, y: 350, count: 5 }, // Base (5 bottles, spread across 300px)
//         { x: 200, y: 300, count: 4 }, // Second row
//         { x: 250, y: 250, count: 3 }, // Third row
//         { x: 300, y: 200, count: 2 }, // Fourth row
//         { x: 350, y: 150, count: 1 }  // Top
//     ];

//     let correct = true;
//     // let placed = 0;
//     let rowCounts = Array(5).fill(0); // Track bottles per row
//     bottles.forEach(bottle => {
//         let found = false;
//         for (let i = 0; i < positions.length; i++) {
//             const pos = positions[i];
//             if (Math.abs(parseInt(bottle.style.left) - pos.x) < 50 && Math.abs(parseInt(bottle.style.top) - pos.y) < 50) {
//                 found = true;
//                 rowCounts[i]++;
//                 placed++;
//                 break;
//             }
//         }
//         if (!found) correct = false;
//     });

//     // Check if each row has the correct number of bottles
//     for (let i = 0; i < positions.length; i++) {
//         if (rowCounts[i] !== positions[i].count) correct = false;
//     }

//     if (correct && placed === 15) { // All 15 bottles placed correctly in pyramid
//         stars += 30;
//         gameArea.innerHTML += `<p>Yay! You built a perfect pyramid! 🎉</p>`;
//         speakLyrics("Yay! You built a perfect pyramid!");
//         celebrateEnd();
//         showNextLevelButton();
//     }
// }

// Level 3: Bottle Catch (Add Bottle on Catch, No Change on Miss)
function startBottleCatch() {
    bottleWall.classList.add("hidden");
    gameArea.classList.remove("hidden");
    gameArea.innerHTML = `<h2>Catch the Falling Bottles!</h2><div class="bottle-catch" id="catchArea"><div class="basket" id="basket"></div></div>`;
    numberOfBottles = 0; // Track caught bottles
    stars = 0;
    updateScore();
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
                    updateBuddy("Oops! Missed a bottle!");
                }
                if (isColliding(bottle, basket)) {
                    clearInterval(fall);
                    bottle.remove();
                    numberOfBottles++; // Add a bottle on catch
                    stars += 5;
                    updateScore();
                    updateProgress();
                    updateBuddy(`Great catch! You have ${numberOfBottles} bottles!`);
                }
            }, 30);
        } else {
            gameArea.innerHTML += `<p>Yay! You caught enough bottles! 🎉</p>`;
            speakLyrics("Yay! You caught enough bottles!");
            celebrateEnd();
            showNextLevelButton();
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

// Level 4: Bottle Puzzle (Fixed)
function startBottlePuzzle() {
    bottleWall.classList.add("hidden");
    gameArea.classList.remove("hidden");
    gameArea.innerHTML = `<h2>Solve the Bottle Puzzle!</h2><div class="bottle-puzzle" id="puzzleArea"></div>`;
    numberOfBottles = 0; // Reset for puzzle
    stars = 0;
    updateScore();
    createPuzzle();
}

function createPuzzle() {
    const puzzleArea = document.getElementById("puzzleArea");
    const pieces = [
        { x: 50, y: 50, id: "piece1" },
        { x: 150, y: 50, id: "piece2" },
        { x: 50, y: 150, id: "piece3" },
        { x: 150, y: 150, id: "piece4" }
    ];
    puzzleArea.innerHTML = "";
    pieces.forEach((pos, index) => {
        let piece = document.createElement("div");
        piece.classList.add("puzzle-piece");
        piece.id = pos.id;
        piece.style.background = `url('/bottle-removebg-preview.png') no-repeat center/contain`;
        piece.style.left = `${Math.random() * 300}px`;
        piece.style.top = `${Math.random() * 200}px`;
        piece.draggable = true;
        piece.addEventListener("dragstart", dragStartPuzzle);
        piece.addEventListener("dragover", dragOverPuzzle);
        piece.addEventListener("drop", dropPuzzle);
        puzzleArea.appendChild(piece);
    });
    puzzleArea.addEventListener("dragover", dragOverPuzzle);
    puzzleArea.addEventListener("drop", dropPuzzle);
}

let draggedPiece = null;

function dragStartPuzzle(e) {
    draggedPiece = e.target;
    e.dataTransfer.setData("text/plain", e.target.id);
}

function dragOverPuzzle(e) {
    e.preventDefault();
}

function dropPuzzle(e) {
    e.preventDefault();
    if (draggedPiece) {
        const id = e.dataTransfer.getData("text/plain");
        const piece = document.getElementById(id);
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left - 50; // Center piece
        const y = e.clientY - rect.top - 50;
        piece.style.left = `${x}px`;
        piece.style.top = `${y}px`;
        checkPuzzleComplete();
    }
}

function checkPuzzleComplete() {
    const pieces = document.querySelectorAll(".puzzle-piece");
    const targetPositions = [
        { x: 50, y: 50, id: "piece1" },
        { x: 150, y: 50, id: "piece2" },
        { x: 50, y: 150, id: "piece3" },
        { x: 150, y: 150, id: "piece4" }
    ];
    let complete = true;
    pieces.forEach(piece => {
        const pos = targetPositions.find(p => p.id === piece.id);
        const currentX = parseInt(piece.style.left);
        const currentY = parseInt(piece.style.top);
        if (Math.abs(currentX - pos.x) > 20 || Math.abs(currentY - pos.y) > 20) {
            complete = false;
        }
    });
    if (complete) {
        stars += 40;
        gameArea.innerHTML += `<p>Yay! Puzzle solved! 🎉</p>`;
        speakLyrics("Yay! Puzzle solved!");
        celebrateEnd();
        showNextLevelButton();
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
    bottleWall.classList.add("celebrate");
    document.body.classList.add("celebrate-body");
    cheerSound.play();
    // launchConfetti();
    setTimeout(() => {
        bottleWall.classList.remove("celebrate");
        document.body.classList.remove("celebrate-body");
    }, 6000);
}
// import confetti from 'https://cdnjs.cloudflare.com/ajax/libs/canvas-confetti/1.9.3/confetti.js';

function launchConfetti() {

    console.log("Confetti function called");
    var count = 200;
    var defaults = {
        origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
        });
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });
    fire(0.2, {
        spread: 60,
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}

function showNextLevelButton() {
    console.log("Showing Next Level button"); // Debug log
    nextLevelButton.classList.remove("hidden");
    takeOneButton.classList.add("hidden"); // Hide the "Knock One Down" button
    updateBuddy(`Great job! Click "Next Level" to continue!`);
    nextLevelButton.addEventListener("click", startNextLevel); // Add event listener for Next Level button
}

function startNextLevel() {
    console.log("Next Level button clicked");
    if (currentLevel < 4) {
        currentLevel++;
        completedLevels.push(currentLevel);
        startLevel(currentLevel);
        nextLevelButton.classList.add("hidden");
        takeOneButton.classList.remove("hidden"); // Show the "Knock One Down" button for Level 1, adjust for others
        updateLevelLocks();
        updateBuddy(`Level ${currentLevel} unlocked! Let’s play!`);
    } else {
        updateBuddy(`You’re a Bottle Master! 🎉 Play again for more fun!`);
        nextLevelButton.classList.add("hidden");
        takeOneButton.classList.add("hidden");
    }
}

function checkLevelProgress() {
    if (stars >= 100 * currentLevel) { // Example: 100 stars per level to progress
        showNextLevelButton();
    }
    updateLevelLocks();
}

function updateLevelLocks() {
    for (let i = 1; i <= 4; i++) {
        if (!completedLevels.includes(i)) {
            levelButtons[i].classList.add("locked");
            levelButtons[i].disabled = true;
        } else {
            levelButtons[i].classList.remove("locked");
            levelButtons[i].disabled = false;
            levelButtons[i].onclick = () => {
                startLevel(i);
                hideLevels();
            };
        }
    }
}

// function dragStart(e) {
//     const bottle = e.target;
//     bottle.classList.add("dragging");
//     e.dataTransfer.setData("text/plain", bottle.id);
// }

// function dragOver(e) {
//     e.preventDefault();
// }

// function drop(e) {
//     e.preventDefault();
    
//     const id = e.dataTransfer.getData("text/plain");
//     const bottle = document.getElementById(id);
//     const dropZone = e.target.closest("#stackArea"); // Ensure it's inside pyramid area

//     if (bottle && dropZone) {
//         const rect = dropZone.getBoundingClientRect();
//         const x = e.clientX - rect.left - 25; // Center bottle
//         const y = e.clientY - rect.top - 50;

//         // Ensure bottle stays inside the drop zone
//         const maxX = rect.width - 50;
//         const maxY = rect.height - 100;
//         bottle.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
//         bottle.style.top = `${Math.max(0, Math.min(y, maxY))}px`;

//         bottle.classList.remove("dragging");
//         checkPyramidComplete();
//     }
// }


document.addEventListener("DOMContentLoaded", () => {
    startLevel(1);
    updateBuddy("Hi! Let’s start our bottle adventure!");
    updateLevelLocks();
});