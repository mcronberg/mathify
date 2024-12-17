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

    // Get references to footer elements
    const footerSlogan = document.getElementById('footer-slogan');
    const endTestBtn = document.getElementById('end-test-btn');

    // References to selection buttons
    const levelSelection = document.getElementById('level-selection');
    const levelButtons = document.querySelectorAll('.level-btn');
    const questionButtons = document.querySelectorAll('.num-btn');
    const startTestBtn = document.getElementById('start-test-btn');

    // New references for provider toggle buttons
    const providerButtons = document.querySelectorAll('.provider-btn');

    // Reference to animation container
    const animationContainer = document.getElementById('animation-container');

    // Reference to options container
    const optionsContainer = document.getElementById('options-container');

    // Reference to prompt element
    const promptElement = document.getElementById('question-prompt');

    // Variables to store selections
    let selectedOperation = 'Addition'; // Preselect Addition
    let selectedLevel = 1; // Preselect Level 1
    let selectedNumQuestions = 1; // Preselect Number of Questions 1

    // Variable to store the current question
    let currentQuestion = null;

    // Variable to store the mixed questions
    let mixedQuestions = [];

    // Load saved selections from local storage
    function loadSelections() {
        const savedOperation = localStorage.getItem('selectedOperation');
        const savedLevel = localStorage.getItem('selectedLevel');
        const savedNumQuestions = localStorage.getItem('selectedNumQuestions');

        if (savedOperation) {
            selectedOperation = savedOperation;
            const operationButton = document.getElementById(`provider-${savedOperation.toLowerCase()}-btn`);
            if (operationButton) {
                operationButton.classList.add('active', 'bg-blue-500', 'text-white');
                operationButton.classList.remove('bg-gray-200');
            }
        }

        if (savedLevel && !isNaN(savedLevel)) {
            selectedLevel = parseInt(savedLevel);
            const levelButton = document.querySelector(`.level-btn:nth-child(${selectedLevel})`);
            if (levelButton) {
                levelButton.classList.add('active', 'bg-blue-500', 'text-white');
                levelButton.classList.remove('bg-gray-200');
            }
        }

        if (savedNumQuestions && !isNaN(savedNumQuestions)) {
            selectedNumQuestions = parseInt(savedNumQuestions);
            const numQuestionsButton = document.querySelector(`.num-btn:nth-child(${selectedNumQuestions})`);
            if (numQuestionsButton) {
                numQuestionsButton.classList.add('active', 'bg-blue-500', 'text-white');
                numQuestionsButton.classList.remove('bg-gray-200');
            }
        }

        // Enable the Start Test button if all selections are made
        if (selectedOperation !== null && selectedLevel !== null && selectedNumQuestions !== null) {
            startTestBtn.disabled = false;
        }
    }

    // Save selections to local storage
    function saveSelections() {
        localStorage.setItem('selectedOperation', selectedOperation);
        localStorage.setItem('selectedLevel', selectedLevel);
        localStorage.setItem('selectedNumQuestions', selectedNumQuestions);
    }

    // Function to handle provider toggle
    function handleProviderToggle(operationName, button) {
        if (selectedOperation === operationName) {
            selectedOperation = null;
            button.classList.remove('active', 'bg-blue-500', 'text-white');
            button.classList.add('bg-gray-200');
        } else {
            // Deselect any previously selected operation
            if (selectedOperation !== null) {
                const previousButton = document.querySelector(`.provider-btn.active`);
                if (previousButton) {
                    previousButton.classList.remove('active', 'bg-blue-500', 'text-white');
                    previousButton.classList.add('bg-gray-200');
                }
            }
            selectedOperation = operationName;
            button.classList.add('active', 'bg-blue-500', 'text-white');
            button.classList.remove('bg-gray-200');
        }

        // Check if all selections are made to enable the Start Test button
        if (selectedOperation !== null && selectedLevel !== null && selectedNumQuestions !== null) {
            startTestBtn.disabled = false;
        } else {
            startTestBtn.disabled = true;
        }

        // Save selections to local storage
        saveSelections();
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

        // Add click event listener to handle level selection
        button.addEventListener('click', () => {
            // Remove active classes from all level buttons
            levelButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-blue-500', 'text-white');
                btn.classList.add('bg-gray-200');
            });

            // Add active classes to the clicked button
            button.classList.add('active', 'bg-blue-500', 'text-white');
            button.classList.remove('bg-gray-200');

            // Set the selected level
            selectedLevel = parseInt(button.textContent.trim().split(' ')[1]);

            // Check if all selections are made to enable the Start Test button
            if (selectedOperation !== null && selectedLevel !== null && selectedNumQuestions !== null) {
                startTestBtn.disabled = false;
            } else {
                startTestBtn.disabled = true;
            }

            // Save selections to local storage
            saveSelections();
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

            // Set the selected number of questions
            selectedNumQuestions = parseInt(button.textContent.trim());

            // Check if all selections are made to enable the Start Test button
            if (selectedOperation !== null && selectedLevel !== null && selectedNumQuestions !== null) {
                startTestBtn.disabled = false;
            } else {
                startTestBtn.disabled = true;
            }

            // Save selections to local storage
            saveSelections();
        });

        button.addEventListener('focusout', () => {
            if (button.classList.contains('active')) {
                // Maintain active state after focus is lost
                button.classList.add('bg-blue-500', 'text-white');
            }
        });
    });

    // Load saved selections from local storage
    loadSelections();

    // Function to end the test and return to the start screen
    function endTest() {
        console.log('Ending test...');
        // Hide question screen and show start screen
        questionScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');

        // Show footer slogan and hide "End Test" button
        footerSlogan.classList.remove('hidden');
        endTestBtn.classList.add('hidden');

        // Reset selections and counters
        currentQuestion = null;
        mixedQuestions = [];

        // Load saved selections from local storage
        loadSelections();

        // Clear any existing animations or options
        animationContainer.innerHTML = '';
        optionsContainer.innerHTML = '';
        promptElement.textContent = 'Loading question...';
    }

    // Function to start the test with selected options
    function startTest() {
        console.log('Starting test...');
        if (selectedOperation === null || selectedLevel === null || selectedNumQuestions === null) {
            alert('Please select an operation, a level, and the number of questions.');
            return;
        }

        // Find selected providers
        const activeProviders = providers.filter(p => p.name === selectedOperation);

        if (activeProviders.length === 0) {
            console.error(`No providers selected.`);
            return;
        }

        // Set the global level for all active providers
        activeProviders.forEach(provider => provider.setLevel(selectedLevel));

        // Generate mixed questions
        mixedQuestions = [];
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
            console.log('Loading question...');
            // Clear previous animation
            animationContainer.innerHTML = '';

            if (currentQuestionIndex >= mixedQuestions.length) {
                endTest();
                return;
            }

            // Get the current question
            currentQuestion = mixedQuestions[currentQuestionIndex];
            console.log(`Loading question ${currentQuestionIndex + 1} of ${mixedQuestions.length}`);

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
            console.log('Option clicked...');
            const selectedValue = parseInt(event.target.value);
            const isCorrect = selectedValue === currentQuestion.correctAnswer;

            if (isCorrect) {
                // Show correct animation
                showAnimation('correct');
                // Advance to next question after a short delay
                setTimeout(() => {
                    currentQuestionIndex += 1;
                    if (currentQuestionIndex < mixedQuestions.length) {
                        loadQuestion();
                    } else {
                        endTest();
                    }
                }, 1000);
            } else {
                // Show wrong animation
                showAnimation('wrong');
            }
        }

        // Show animation based on answer correctness
        function showAnimation(type) {
            console.log('Showing animation...');
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

