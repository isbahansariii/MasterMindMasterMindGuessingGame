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

// Code for desktop i.e. dragable
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
// Code for desktop i.e. dragable

// code for mobile phones i.e. double click
// const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// if (isMobile) {
//     console.log("Mobile detected: Switching to click functionality");

//     // Add click functionality for mobile devices
//     draggableItems.forEach(item => {
//         item.addEventListener("click", event => {
//             // Retrieve the item's value and background color
//             const value = item.children[0].innerText;
//             const bgColor = item.classList[1];

//             // Highlight potential drop targets for better UX
//             targetSlots.forEach(slot => slot.classList.add("hovered"));

//             // Add event listener to target slots for placing the item on click
//             targetSlots.forEach(slot => {
//                 slot.addEventListener("click", function handleDrop() {
//                     // Apply value and background color to the clicked slot
//                     slot.style.backgroundColor = bgColor;
//                     slot.innerText = value;

//                     // Remove highlighting and the temporary click listener
//                     targetSlots.forEach(slot => slot.classList.remove("hovered"));
//                     slot.removeEventListener("click", handleDrop);
//                 });
//             });
//         });
//     });
// } else {
//     console.log("Desktop detected: Drag and drop enabled");

//     // Default drag-and-drop functionality for desktops
//     draggableItems.forEach(item => {
//         item.setAttribute("draggable", true);
//         item.addEventListener("dragstart", event => {
//             console.log("Draggable Item -->", event);
//             event.dataTransfer.setData("value", event.target.children[0].innerText);
//             event.dataTransfer.setData("bgColor", event.target.classList[1]);
//         });
//     });

//     targetSlots.forEach(slot => {
//         slot.addEventListener("dragover", event => {
//             event.preventDefault();
//             slot.classList.add("hovered");
//         });

//         slot.addEventListener("drop", event => {
//             event.preventDefault();
//             const value = event.dataTransfer.getData("value");
//             const color = event.dataTransfer.getData("bgColor");
//             slot.style.backgroundColor = color;
//             slot.innerText = value;

//             slot.classList.remove("hovered");
//         });
//     });
// }
// code for mobile phones i.e. double click

// code for mobile phones i.e. Tap to Select, Tap to Place start
let selectedItem = null;

draggableItems.forEach(item => {
    item.addEventListener("click", () => {
        // Highlight the item as selected
        if (selectedItem) {
            selectedItem.classList.remove("selected");
        }
        selectedItem = item;
        selectedItem.classList.add("selected");

        // Highlight drop slots
        targetSlots.forEach(slot => slot.classList.add("hovered"));
    });
});

targetSlots.forEach(slot => {
    slot.addEventListener("click", () => {
        if (selectedItem) {
            // Get data from the selected item
            const value = selectedItem.children[0].innerText;
            const bgColor = selectedItem.classList[1];

            // Place the item in the slot
            slot.style.backgroundColor = bgColor;
            slot.innerText = value;

            // Cleanup: remove highlights and deselect the item
            selectedItem.classList.remove("selected");
            selectedItem = null;
            targetSlots.forEach(slot => slot.classList.remove("hovered"));
        }
    });
});
// code for mobile phones i.e. Tap to Select, Tap to Place end

// Function to check the guess
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

// Restart Game function
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
