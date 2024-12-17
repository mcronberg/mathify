export function initMobileMenu() {
    const menuBtn = document.getElementById('burger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('menu-overlay');

    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('translate-x-full');
        overlay.classList.toggle('hidden');
    });

    overlay.addEventListener('click', () => {
        mobileMenu.classList.add('translate-x-full');
        overlay.classList.add('hidden');
    });
}
