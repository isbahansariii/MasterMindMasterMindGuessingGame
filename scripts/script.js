let encryptedPlayer = [];
let noOfGuess = 0;
let checkCount = 0; 
const draggableItems = document.querySelectorAll(".draggable-box");
const targetSlots = document.querySelectorAll(".target-box");
const btn = document.getElementById("submit-btn");
const restartBtn = document.getElementById("restart-btn");

// Initial Secret Code generation
while (encryptedPlayer.length < 4) {
    let result = Math.floor(Math.random() * 6 + 1);
    if (!encryptedPlayer.includes(result)) {
        encryptedPlayer.push(result);
    }
}

draggableItems.forEach(item => {
    item.setAttribute("draggable", true); 
    item.addEventListener("dragstart", event => {
        console.log("Draggable Item-->",event);
        event.dataTransfer.setData("value", event.target.children[0].innerText);
        event.dataTransfer.setData("bgColor", event.target.classList[1]);
    });
});

targetSlots.forEach(slot => {
    slot.addEventListener("dragover", event => { 
        event.preventDefault();
        slot.classList.add("hovered");
    });

    
    slot.addEventListener("drop", event => {
        event.preventDefault();
        const value = event.dataTransfer.getData("value");
        const color = event.dataTransfer.getData("bgColor");
            slot.style.backgroundColor = color; 
            slot.innerText = value;
        
    });
});

// for mobile
let selectedItem = null;

draggableItems.forEach(item => {
    item.addEventListener("click", () => {
        if (selectedItem) {
            selectedItem.classList.remove("selected");
        }
        selectedItem = item;
        selectedItem.classList.add("selected");

        targetSlots.forEach(slot => slot.classList.add("hovered"));
    });
});

targetSlots.forEach(slot => {
    slot.addEventListener("click", () => {
        if (selectedItem) {
            const value = selectedItem.children[0].innerText;
            const bgColor = selectedItem.classList[1];

            slot.style.backgroundColor = bgColor;
            slot.innerText = value;

            selectedItem.classList.remove("selected");
            selectedItem = null;
            targetSlots.forEach(slot => slot.classList.remove("hovered"));
        }
    });
});

btn.addEventListener("click", checkGuess);
function checkGuess() {
    let decryptedPlayer = [];
    let correctPositions = [];
    let wrongPositions = [];
    let incorrectNumbers = [];
    checkDuplicateInput = [];
    checkCount = 0;
    noOfGuess++;

    targetSlots.forEach(slot => {
        decryptedPlayer.push(slot?.innerText ? parseInt(slot?.innerText) : null);
    });

    if (decryptedPlayer.includes(null)) {
        alert("Please fill all 4 slots before submitting!");
        return;
    }

    for (let j = 0; j < encryptedPlayer.length; j++) {
        if (encryptedPlayer[j] === decryptedPlayer[j]) {
            checkCount++;
            correctPositions.push(decryptedPlayer[j]);
        } else if (encryptedPlayer.includes(decryptedPlayer[j])) {
            wrongPositions.push(decryptedPlayer[j]);
        } else {
            incorrectNumbers.push(decryptedPlayer[j]);
        }
    }

    let hintMessage = "";
    if (correctPositions.length > 0) {
        hintMessage += `${correctPositions.length} black ✔ (${correctPositions.join(", ")} are correct & in the right place.)<br>`;
    }
    if (wrongPositions.length > 0) {
        hintMessage += `${wrongPositions.length} white ⚪ (${wrongPositions.join(", ")} are correct but in the wrong place.)<br>`;
    }
    if (incorrectNumbers.length > 0) {
        hintMessage += `❌ ${incorrectNumbers.join(", ")} are incorrect.<br>`;
    }
    document.getElementById("hint-message").innerHTML = hintMessage;

    if (checkCount === encryptedPlayer.length) {
        document.getElementById("hint-message").innerHTML = `🎉 Congratulations! You guessed correctly in ${noOfGuess} attempts.`;
        draggableItems.forEach(item => {
            item.setAttribute("draggable", false);
            item.style.cursor = "pointer";
        });
    }
};

function restartGame() {
    encryptedPlayer = [];
    noOfGuess = 0;
    checkCount = 0;
    targetSlots.forEach(slot => {
        slot.textContent = "";
        slot.style.backgroundColor = "transparent";
    });
    document.getElementById("hint-message").innerHTML = "";
    while (encryptedPlayer.length < 4) {
        let result = Math.floor(Math.random() * 6 + 1);
        if (!encryptedPlayer.includes(result)) {
            encryptedPlayer.push(result);
        }
    }
    alert("Game restarted! A new secret code has been generated. Good luck!");
}
restartBtn.addEventListener("click", restartGame);