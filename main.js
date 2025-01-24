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

// touch and mouse movements

function attachPointerListeners() {
  // Remove previous touch listeners to avoid duplication
  cardOrder.forEach((card) => {
    card.removeEventListener("pointerdown", handlePointerDown);
    card.removeEventListener("pointermove", handlePointerMove);
    card.removeEventListener("pointerup", handlePointerUp);
    card.removeEventListener("pointercancel", handlePointerUp);

    card.removeEventListener("touchstart", handleTouchStart);
    card.removeEventListener("touchmove", handleTouchMove);
    card.removeEventListener("touchend", handleTouchEnd);
  });

  // Add listeners to the current card
  const currentCard = document.querySelector(".current");
  currentCard.addEventListener("pointerdown", handlePointerDown);
  currentCard.addEventListener("pointermove", handlePointerMove);
  currentCard.addEventListener("pointerup", handlePointerUp);
  currentCard.addEventListener("pointercancel", handlePointerUp);

  currentCard.addEventListener("touchstart", handleTouchStart);
  currentCard.addEventListener("touchmove", handleTouchMove);
  currentCard.addEventListener("touchend", handleTouchEnd);
}

// Common functions for both pointer and touch
function startDrag(x) {
  startX = x;
  isDragging = true;
}

function endDrag() {
  isDragging = false;
  startX = 0;
}

function moveDrag(currentX) {
  const diffX = currentX - startX;

  if (Math.abs(diffX) > 30) {
    if (diffX > 0) {
      moveRight();
    } else {
      moveLeft();
    }
    isDragging = false;
  }
}

// Pointer event handlers
function handlePointerDown(e) {
  if (!e.isPrimary) return;
  e.preventDefault();
  startDrag(e.clientX);
}

function handlePointerMove(e) {
  if (!isDragging) return;
  e.preventDefault(); // Prevent unwanted behaviors
  moveDrag(e.clientX);
}

function handlePointerUp(e) {
  if (!e.isPrimary) return;
  endDrag();
}

// Touch event handlers
function handleTouchStart(e) {
  if (e.touches.length > 1) return; // Ignore multi-touch
  startDrag(e.touches[0].clientX);
}

function handleTouchMove(e) {
  if (!isDragging) return;
  e.preventDefault(); // Prevent unwanted behaviors
  moveDrag(e.touches[0].clientX);
}

function handleTouchEnd(e) {
  endDrag();
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
