function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

const phrases = ["Backend-Developer", "Learner", "Designer", "Educator"];
let index = 0;
let charIndex = 0;
const dynamicText = document.getElementById("dynamic-text");

function type() {
    if (charIndex < phrases[index].length) {
        dynamicText.textContent += phrases[index].charAt(charIndex);
        charIndex++;
        setTimeout(type, 100); // Adjust typing speed here
    } else {
        setTimeout(deleteText, 1000); // Wait before deleting
    }
}

function deleteText() {
    if (charIndex > 0) {
        dynamicText.textContent = phrases[index].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(deleteText, 50); // Adjust deleting speed here
    } else {
        index = (index + 1) % phrases.length; // Move to the next phrase
        setTimeout(type, 500); // Wait before starting the next phrase
    }
}

// Start the typing effect
type();
