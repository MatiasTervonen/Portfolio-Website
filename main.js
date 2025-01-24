// Carousel for card elements

const cards = document.querySelectorAll(".cardContainer > div"); // Select all card elements
const cardContainer = document.querySelector(".cardContainer");

let cardOrder = Array.from(cards);

let startX = 0; // Tracks the starting pointer position
let isDragging = false; // To track if the pointer is dragging

// Add current status always to the card that is first card or active.

function slides() {
  cardOrder.forEach((card, index) => {
    // Remove all possible position-related classes
    card.classList.remove(
      "current",
      "rightEdge",
      "leftEdge",
      "rightMiddle",
      "leftMiddle"
    );

    // Assign classes based on index in the array
    if (index === 0) {
      card.classList.add("current"); // Center card
    } else if (index === 1) {
      card.classList.add("rightMiddle"); // Second card on the right
    } else if (index === 4) {
      card.classList.add("leftMiddle"); // Second card on the left
    } else if (index === 2) {
      card.classList.add("rightEdge"); // Right-most card
    } else if (index === 3) {
      card.classList.add("leftEdge"); // Left-most card
    }
  });

  attachPointerListeners();
}

slides();
// touch movement

// Attach touchstart and touchmove events to the current card
function attachPointerListeners() {
  // Remove previous touch listeners to avoid duplication
  cardOrder.forEach((card) => {
    card.removeEventListener("pointerdown", handlePointerDown);
    card.removeEventListener("pointermove", handlePointerMove);
    card.removeEventListener("pointerup", handlePointerUp);
    card.removeEventListener("pointercancel", handlePointerUp);
  });

  // Add listeners to the current card
  const currentCard = document.querySelector(".current");
  currentCard.addEventListener("pointerdown", handlePointerDown);
  currentCard.addEventListener("pointermove", handlePointerMove);
  currentCard.addEventListener("pointerup", handlePointerUp);
  currentCard.addEventListener("pointercancel", handlePointerUp);
}

// Handle pointer down (start of swipe/drag)
function handlePointerDown(e) {
  if (!e.isPrimary) return; // Ignore non-primary pointers
  startX = e.clientX; // Store the starting position
  isDragging = true; // Mark as dragging
}

// Handle pointer move (swiping/dragging)
function handlePointerMove(e) {
  if (!isDragging) return; // Ignore if not dragging
  const currentX = e.clientX;
  const diffX = currentX - startX; // Calculate movement

  if (Math.abs(diffX) > 30) {
    e.preventDefault(); // Prevent vertical scrolling
    // Only register significant swipes
    if (diffX > 0) {
      moveRight(); // Swipe right
    } else {
      moveLeft(); // Swipe left
    }
    isDragging = false; // End the drag after detecting a swipe
  }
}

// Handle pointer up (end of swipe/drag)
function handlePointerUp(e) {
  if (!e.isPrimary) return; // Ignore non-primary pointers
  isDragging = false; // Reset dragging state
  startX = 0; // Reset start position
}

function moveRight() {
  // Move the last card to the beginning of the array
  const lastCard = cardOrder.pop(); // Remove the last card
  cardOrder.unshift(lastCard); // Add it to the start

  // Update the classes based on the new order
  slides();
}

function moveLeft() {
  // Move the first card to the end of the array
  const firstCard = cardOrder.shift(); // Remove the first card
  cardOrder.push(firstCard); // Add it to the end

  // Update the classes based on the new order
  slides();
}

slides();
attachPointerListeners();
