import Settings from './settings.js';
import { initUI } from './ui.js';
import { AdditionProvider } from './providers/additionProvider.js';
import { SubtractionProvider } from './providers/subtractionProvider.js';
import { MultiplicationProvider } from './providers/multiplicationProvider.js';

document.addEventListener('DOMContentLoaded', () => {
    const settings = new Settings();
    const providers = [
        new AdditionProvider(),
        new SubtractionProvider(),
        new MultiplicationProvider()
        // Add more providers here as needed
    ];

    // Dynamically add provider buttons to the HTML
    const providerContainer = document.querySelector('.selection-container .flex-col');
    providers.forEach(provider => {
        const button = document.createElement('button');
        button.type = 'button';
        button.id = `provider-${provider.name.toLowerCase()}-btn`;
        button.className = 'provider-btn selection-button px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition';
        button.textContent = provider.name;
        providerContainer.appendChild(button);
    });

    initUI(settings, providers);
});

