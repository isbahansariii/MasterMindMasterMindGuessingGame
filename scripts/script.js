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

// Event listeners for draggable items
// draggableItems.forEach(item => {
//     // Enable dragging for desktop and touch events for mobile
//     if (item) {
//         item.setAttribute("draggable", true);
        
//         item.addEventListener("dragstart", event => {
//             event.dataTransfer.setData("value", event.target.children[0].innerText);
//             event.dataTransfer.setData("bgColor", event.target.classList[1]);
//         });

//         // Mobile Compatibility - Touch Events for Dragging
//         item.addEventListener("touchstart", (event) => {
//             const touch = event.touches[0];
//             event.target.style.position = "absolute";
//             event.target.style.zIndex = 1000;
//             event.target.style.left = touch.pageX + "px";
//             event.target.style.top = touch.pageY + "px";
//         });

//         item.addEventListener("touchmove", (event) => {
//             const touch = event.touches[0];
//             event.target.style.left = touch.pageX + "px";
//             event.target.style.top = touch.pageY + "px";
//         });

//         item.addEventListener("touchend", (event) => {
//             const touch = event.changedTouches[0];
//             const closestSlot = getClosestSlot(touch.pageX, touch.pageY);
//             if (closestSlot) {
//                 closestSlot.style.backgroundColor = event.target.classList[1];
//                 closestSlot.innerText = event.target.children[0].innerText;
//             }
//             event.target.style.position = "";
//         });
//     }
// });

// // Function to find closest target slot
// function getClosestSlot(x, y) {
//     let closestSlot = null;
//     let minDistance = Infinity;
    
//     targetSlots.forEach(slot => {
//         const rect = slot.getBoundingClientRect();
//         const distance = Math.sqrt(Math.pow(x - rect.left, 2) + Math.pow(y - rect.top, 2));
        
//         if (distance < minDistance) {
//             minDistance = distance;
//             closestSlot = slot;
//         }
//     });
    
//     return closestSlot;
// }

// // Event listeners for target slots
// targetSlots.forEach(slot => {
//     slot.addEventListener("dragover", event => {
//         event.preventDefault();
//         slot.classList.add("hovered");
//     });

//     slot.addEventListener("drop", event => {
//         event.preventDefault();
//         const value = event.dataTransfer.getData("value");
//         const color = event.dataTransfer.getData("bgColor");
//         slot.style.backgroundColor = color;
//         slot.innerText = value;
//     });

//     // Mobile Compatibility - Touch Events for Dropping
//     slot.addEventListener("touchmove", (event) => {
//         event.preventDefault();
//     });

//     slot.addEventListener("touchend", (event) => {
//         const touch = event.changedTouches[0];
//         const value = event.target.innerText;
//         const color = event.target.style.backgroundColor;
//         event.target.innerText = value;
//         event.target.style.backgroundColor = color;
//     });
// });

// Code new

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

// code new end

// gpt code start 
// Detect if the device is mobile
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
    console.log("Mobile detected: Switching to click functionality");

    // Add click functionality for mobile devices
    draggableItems.forEach(item => {
        item.addEventListener("click", event => {
            // Retrieve the item's value and background color
            const value = item.children[0].innerText;
            const bgColor = item.classList[1];

            // Highlight potential drop targets for better UX
            targetSlots.forEach(slot => slot.classList.add("hovered"));

            // Add event listener to target slots for placing the item on click
            targetSlots.forEach(slot => {
                slot.addEventListener("click", function handleDrop() {
                    // Apply value and background color to the clicked slot
                    slot.style.backgroundColor = bgColor;
                    slot.innerText = value;

                    // Remove highlighting and the temporary click listener
                    targetSlots.forEach(slot => slot.classList.remove("hovered"));
                    slot.removeEventListener("click", handleDrop);
                });
            });
        });
    });
} else {
    console.log("Desktop detected: Drag and drop enabled");

    // Default drag-and-drop functionality for desktops
    draggableItems.forEach(item => {
        item.setAttribute("draggable", true);
        item.addEventListener("dragstart", event => {
            console.log("Draggable Item -->", event);
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

            slot.classList.remove("hovered");
        });
    });
}

// gpt code end

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
