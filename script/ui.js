import { initStartScreenUI } from './ui/startScreenUI.js';
import { initQuestionScreenUI } from './ui/questionScreenUI.js';

export function initUI(settings, providers) {
    const startScreen = document.getElementById('start-screen');
    const questionScreen = document.getElementById('question-screen');
    const footerSlogan = document.getElementById('footer-slogan');
    const endTestBtn = document.getElementById('end-test-btn');
    const startTestBtn = document.getElementById('start-test-btn');

    function endTest() {
        questionScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        footerSlogan.classList.remove('hidden');
        endTestBtn.classList.add('hidden');
        // Clear any existing animations or options
        document.getElementById('animation-container').innerHTML = '';
        document.getElementById('options-container').innerHTML = '';
        document.getElementById('question-prompt').textContent = 'Loading question...';
    }

    const questionScreenStartTest = initQuestionScreenUI(providers, endTest, settings);
    initStartScreenUI(settings, providers, questionScreenStartTest);
}
