// Function to prevent drag in carousell

function makeCarouselDragSafe(containerSelector) {
  const container = document.querySelector(containerSelector);

  if (!container) return;

  container.querySelectorAll("img, a, button").forEach((el) => {
    el.setAttribute("draggable", "false");
    el.style.webkitUserDrag = "none";
    el.style.userSelect = "none";
  });

  container.addEventListener("dragstart", (e) => {
    e.preventDefault();
  });

  container.style.touchAction = "pan-y";
}

// Carousel for card elements

const cards = document.querySelectorAll(".cardContainer > div"); // Select all card elements
const cardContainer = document.querySelector(".cardContainer");

let cardOrder = Array.from(cards);

let startX = 0; // Tracks the starting pointer position
let isDragging = false; // To track if the pointer is dragging

// Scroll indicator

const indicator = document.querySelectorAll(".indicator > li ");

let indicatorOrder = Array.from(indicator);

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
      card.classList.add("rightMiddle");
    } else if (index === 4) {
      card.classList.add("leftMiddle");
    } else if (index === 2) {
      card.classList.add("rightEdge");
    } else if (index === 3) {
      card.classList.add("leftEdge");
    }
  });

  updateIndicator();
  attachPointerListeners();
}

const centerIndex = Math.floor(indicatorOrder.length / 2);

function updateIndicator() {
  const isLightMode = document.body.classList.contains("light-mode");

  // Find the active card's index
  const activeCardIndex = cardOrder.findIndex((card) =>
    card.classList.contains("current")
  );

  // Map the active card index to the corresponding indicator index
  const activeIndicatorIndex =
    (centerIndex + activeCardIndex) % indicatorOrder.length;

  // Highlight the correct indicator
  indicatorOrder.forEach((indicator, index) => {
    if (index === activeIndicatorIndex) {
      if (isLightMode) {
        indicator.classList.add("bg-black-indicator");
        indicator.classList.remove("bg-white-indicator"); // Highlight the active indicator
      } else {
        indicator.classList.add("bg-white-indicator");
        indicator.classList.remove("bg-black-indicator"); // Reset others
      }
    } else {
      indicator.classList.remove("bg-white-indicator", "bg-black-indicator");
    }
  });
}

// touch and mouse movements

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
  startDrag(e.clientX);
}

function handlePointerMove(e) {
  if (!isDragging) return;
  moveDrag(e.clientX);
}

function handlePointerUp(e) {
  if (!e.isPrimary) return;
  endDrag();
}

function moveRight() {
  // Move the last card to the beginning of the array
  const lastCard = cardOrder.pop(); // Remove the last card
  cardOrder.unshift(lastCard); // Add it to the start

  // Update the classes based on the new order

  const lastIndicator = indicatorOrder.pop();
  indicatorOrder.unshift(lastIndicator);

  slides();
}

function moveLeft() {
  // Move the first card to the end of the array
  const firstCard = cardOrder.shift(); // Remove the first card
  cardOrder.push(firstCard); // Add it to the end

  // Update the classes based on the new order

  const firstIndicator = indicatorOrder.shift();
  indicatorOrder.push(firstIndicator);

  slides();
}

slides();
attachPointerListeners();

makeCarouselDragSafe(".cardContainer");

console.log(makeCarouselDragSafe);

// LightMode button

document.getElementById("toggleSwitch");
document.getElementById("menuToggleSwitch");

const moon = document.querySelector(".moon");
const sun = document.querySelector(".sun");

const moonMenu = document.querySelector(".moonMenu");
const sunMenu = document.querySelector(".sunMenu");

const body = document.body;

toggleSwitch.addEventListener("click", () => {
  toggleSwitch.classList.toggle("active");

  moon.classList.toggle("hidden");
  sun.classList.toggle("hidden");
  body.classList.toggle("light-mode");
  updateIndicator();
});

menuToggleSwitch.addEventListener("click", () => {
  menuToggleSwitch.classList.toggle("active");

  moonMenu.classList.toggle("hidden");
  sunMenu.classList.toggle("hidden");
  body.classList.toggle("light-mode");
  updateIndicator();
});

// hamburger menu

const menuToggle = document.getElementById("menu-toggle");
const menuClose = document.getElementById("menu-close");
const menu = document.getElementById("hamburgerMenu");
const menuLink = document.querySelectorAll(".menuLink");

// Open menu
menuToggle.addEventListener("click", () => {
  menu.classList.remove("close");
  menu.classList.add("open");
  menuClose.classList.remove("hidden");
});

// Close menu
menuClose.addEventListener("click", () => {
  menu.classList.add("close");
});

menuLink.forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.add("close");
  });
});
