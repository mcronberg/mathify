import Settings from './settings.js';
import { initMobileMenu } from './mobileMenu.js';
import { initUI } from './ui.js';
import { createTest } from './testManager.js';
import { AdditionProvider } from './providers/additionProvider.js';
import { SubtractionProvider } from './providers/subtractionProvider.js';

document.addEventListener('DOMContentLoaded', () => {
    const settings = new Settings();
    initMobileMenu();
    const providers = [
        new AdditionProvider(),
        new SubtractionProvider()
        // Add more providers here as needed
    ];
    initUI(settings, providers);
});

