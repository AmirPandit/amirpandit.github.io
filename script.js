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
        setTimeout(type, 100); // Typing speed
    } else {
        setTimeout(deleteText, 1000); // Wait before deleting
    }
}

function deleteText() {
    if (charIndex > 0) {
        dynamicText.textContent = phrases[index].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(deleteText, 50); // Deleting speed
    } else {
        index = (index + 1) % phrases.length; // Move to the next phrase
        setTimeout(type, 500); // Wait before starting the next phrase
    }
}

// Start the typing effect
type();

function openModal(project) {
    const modal = document.getElementById("project-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");

    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;

    modal.style.display = "block"; // Make modal visible
    requestAnimationFrame(() => {
        modal.classList.add("show");
    });

    document.addEventListener("keydown", handleKeyDown);
}

function closeModal() {
    const modal = document.getElementById("project-modal");
    modal.classList.remove("show");

    modal.addEventListener('transitionend', function() {
        modal.style.display = "none"; // Hide the modal
    }, { once: true });

    document.removeEventListener("keydown", handleKeyDown);
}

function handleKeyDown(event) {
    if (event.key === "Escape") {
        closeModal(); // Close the modal when Escape is pressed
    }
}

window.onclick = function(event) {
    const modal = document.getElementById("project-modal");
    if (event.target === modal) {
        closeModal();
    }
};

// Handle project container clicks
document.querySelectorAll('.details-container').forEach(container => {
    const projectData = {
        title: container.getAttribute('data-title'),
        description: container.getAttribute('data-description')
    };

    // Open modal on container click
    container.addEventListener('click', (event) => {
        if (!event.target.closest('.project-btn')) {
            openModal(projectData);
        }
    });

    // Prevent modal from opening when clicking the buttons
    container.querySelectorAll('.project-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent modal from opening
        });
    });
});
