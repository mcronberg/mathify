import Settings from './settings.js';
import { initMobileMenu } from './mobileMenu.js';
import { AdditionProvider } from './providers/additionProvider.js';
import { SubtractionProvider } from './providers/subtractionProvider.js';

document.addEventListener('DOMContentLoaded', () => {
    const settings = new Settings();
    let mySettings = settings.getSettings();

    // Initialize mobile menu
    initMobileMenu();

    // Create an array of all available providers
    const providers = [
        new AdditionProvider(),
        new SubtractionProvider()
        // Add more providers here as needed
    ];

    // References to DOM elements
    const startScreen = document.getElementById('start-screen');
    const questionScreen = document.getElementById('question-screen');
    const startAdditionBtn = document.getElementById('start-addition');
    const startSubtractionBtn = document.getElementById('start-subtraction');

    // Get references to footer elements
    const footerSlogan = document.getElementById('footer-slogan');
    const endTestBtn = document.getElementById('end-test-btn');

    // References to selection buttons
    const levelSelection = document.getElementById('level-selection');
    const levelButtons = document.querySelectorAll('.level-btn');
    const questionsSelection = document.getElementById('questions-selection');
    const questionButtons = document.querySelectorAll('.num-btn');
    const startTestBtn = document.getElementById('start-test-btn');

    // New references for provider toggle buttons
    const providerButtons = document.querySelectorAll('.provider-btn');

    // Variables to store selections
    let selectedOperations = []; // Changed from single selection
    let selectedLevel = null;
    let selectedNumQuestions = null;

    // Function to handle provider toggle
    function handleProviderToggle(operationName, button) {
        if (selectedOperations.includes(operationName)) {
            selectedOperations = selectedOperations.filter(op => op !== operationName);
            button.classList.remove('active', 'bg-blue-500', 'text-white');
            button.classList.add('bg-gray-200');
        } else {
            selectedOperations.push(operationName);
            button.classList.add('active', 'bg-blue-500', 'text-white');
            button.classList.remove('bg-gray-200');
        }

        // Show level selection if at least one operation is selected
        if (selectedOperations.length > 0) {
            levelSelection.classList.remove('hidden');
        } else {
            levelSelection.classList.add('hidden');
            questionsSelection.classList.add('hidden');
            startTestBtn.disabled = true;
        }

        // Reset previous selections
        selectedLevel = null;
        selectedNumQuestions = null;
        questionsSelection.classList.add('hidden');
        startTestBtn.disabled = true;

        // Reset active states for level and question buttons
        levelButtons.forEach(btn => {
            btn.classList.remove('active', 'bg-blue-500', 'text-white');
            btn.classList.add('bg-gray-200');
        });

        questionButtons.forEach(btn => {
            btn.classList.remove('active', 'bg-blue-500', 'text-white');
            btn.classList.add('bg-gray-200');
        });
    }

    // Add event listeners to provider toggle buttons
    providerButtons.forEach(button => {
        button.addEventListener('click', () => {
            const operationName = button.textContent.trim();
            handleProviderToggle(operationName, button);
        });
    });

    // Function to handle global level selection
    levelButtons.forEach(button => {
        // Remove existing click event listener
        /* ...existing click handler removed... */

        // Add focusout event listener to handle active state
        button.addEventListener('click', () => {
            // Remove active classes from all level buttons
            levelButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-blue-500', 'text-white');
                btn.classList.add('bg-gray-200');
            });

            // Temporarily add active classes
            button.classList.add('active');
            button.classList.remove('bg-gray-200');
            button.classList.add('bg-blue-500', 'text-white');
        });

        button.addEventListener('focusout', () => {
            if (button.classList.contains('active')) {
                // Maintain active state after focus is lost
                button.classList.add('bg-blue-500', 'text-white');
            }
        });
    });

    // Function to handle number of questions selection
    questionButtons.forEach(button => {
        // Remove existing click event listener
        /* ...existing click handler removed... */

        // Add focusout event listener to handle active state
        button.addEventListener('click', () => {
            // Remove active classes from all question buttons
            questionButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-blue-500', 'text-white');
                btn.classList.add('bg-gray-200');
            });

            // Temporarily add active classes
            button.classList.add('active');
            button.classList.remove('bg-gray-200');
            button.classList.add('bg-blue-500', 'text-white');
        });

        button.addEventListener('focusout', () => {
            if (button.classList.contains('active')) {
                // Maintain active state after focus is lost
                button.classList.add('bg-blue-500', 'text-white');
            }
        });
    });

    // Function to end the test and return to the start screen
    function endTest() {
        // Hide question screen and show start screen
        questionScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');

        // Show footer slogan and hide "End Test" button
        footerSlogan.classList.remove('hidden');
        endTestBtn.classList.add('hidden');

        // Reset selections and counters
        selectedOperations = [];
        selectedLevel = null;
        selectedNumQuestions = null;

        // Reset the Start Screen selections
        providerButtons.forEach(button => {
            button.classList.remove('active', 'bg-blue-500', 'text-white');
            button.classList.add('bg-gray-200');
        });

        levelButtons.forEach(btn => {
            btn.classList.remove('active', 'bg-blue-500', 'text-white');
            btn.classList.add('bg-gray-200');
        });

        questionButtons.forEach(btn => {
            btn.classList.remove('active', 'bg-blue-500', 'text-white');
            btn.classList.add('bg-gray-200');
        });

        // Clear any existing animations or options
        animationContainer.innerHTML = '';
        optionsContainer.innerHTML = '';
        promptElement.textContent = 'Loading question...';
    }

    // Function to start the test with selected options
    function startTest() {
        if (selectedOperations.length === 0 || !selectedLevel || !selectedNumQuestions) {
            alert('Please select at least one operation, a level, and the number of questions.');
            return;
        }

        // Find selected providers
        const activeProviders = providers.filter(p => selectedOperations.includes(p.name));

        if (activeProviders.length === 0) {
            console.error(`No providers selected.`);
            return;
        }

        // Set the global level for all active providers
        activeProviders.forEach(provider => provider.setLevel(selectedLevel));

        // Generate mixed questions
        const mixedQuestions = [];
        for (let i = 0; i < selectedNumQuestions; i++) {
            const randomProvider = activeProviders[Math.floor(Math.random() * activeProviders.length)];
            const question = randomProvider.generateQuestion();
            mixedQuestions.push(question);
        }

        // Hide start screen and show question screen
        startScreen.classList.add('hidden');
        questionScreen.classList.remove('hidden');

        // Hide footer slogan and show "End Test" button
        footerSlogan.classList.add('hidden');
        endTestBtn.classList.remove('hidden');

        // Initialize question index
        let currentQuestionIndex = 0;

        // Function to load and display a question
        function loadQuestion() {
            // Clear previous animation
            animationContainer.innerHTML = '';

            if (currentQuestionIndex >= mixedQuestions.length) {
                endTest();
                return;
            }

            // Get the current question
            const currentQuestion = mixedQuestions[currentQuestionIndex];
            console.log(currentQuestion);

            // Display the prompt
            promptElement.textContent = currentQuestion.prompt;

            // Clear previous options
            optionsContainer.innerHTML = '';

            // Display options
            currentQuestion.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option.text;
                button.value = option.value;
                button.className = 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition';
                button.addEventListener('click', handleOptionClick);
                optionsContainer.appendChild(button);
            });
        }

        // Handle option click
        function handleOptionClick(event) {
            const selectedValue = parseInt(event.target.value);
            const isCorrect = selectedValue === currentQuestion.correctAnswer;

            if (isCorrect) {
                // Show correct animation
                showAnimation('correct');
                // Advance to next question after a short delay
                setTimeout(() => {
                    currentQuestionIndex += 1;
                    loadQuestion();
                }, 1000);
            } else {
                // Show wrong animation
                showAnimation('wrong');
            }
        }

        // Show animation based on answer correctness
        function showAnimation(type) {
            const animationMsg = document.createElement('div');
            animationMsg.classList.add('animation-message');

            if (type === 'correct') {
                animationMsg.textContent = '✅ Correct!';
                animationMsg.classList.add('text-green-500', 'font-bold', 'text-lg', 'fade-in');
            } else {
                animationMsg.textContent = '❌ Wrong Answer!';
                animationMsg.classList.add('text-red-500', 'font-bold', 'text-lg', 'shake');
            }

            // Append the animation message to the animation container
            animationContainer.appendChild(animationMsg);

            // Remove the animation message after the animation finishes
            setTimeout(() => {
                animationContainer.removeChild(animationMsg);
            }, 1000); // Duration matches the CSS animation duration
        }

        // Function to end the test and return to the start screen
        // Removed from here as it's now defined globally

        // Load the first question
        loadQuestion();
    }

    if (startTestBtn) {
        startTestBtn.addEventListener('click', startTest);
    }

    if (endTestBtn) {
        endTestBtn.addEventListener('click', endTest);
    }
});

