document.addEventListener('DOMContentLoaded', () => {
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const navLinksContainer = document.getElementById('nav-links-container');

    if (hamburgerToggle && navLinksContainer) {
        hamburgerToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            hamburgerToggle.classList.toggle('active');
        });

        // Automatically close menu when selecting any link
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                hamburgerToggle.classList.remove('active');
            });
        });
    }
});