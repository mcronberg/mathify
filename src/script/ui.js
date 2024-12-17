export function initUI(settings, providers) {
    const startScreen = document.getElementById('start-screen');
    const questionScreen = document.getElementById('question-screen');
    const footerSlogan = document.getElementById('footer-slogan');
    const endTestBtn = document.getElementById('end-test-btn');
    const startTestBtn = document.getElementById('start-test-btn');
    const providerButtons = document.querySelectorAll('.provider-btn');
    const levelButtons = document.querySelectorAll('.level-btn');
    const questionButtons = document.querySelectorAll('.num-btn');
    const animationContainer = document.getElementById('animation-container');
    const optionsContainer = document.getElementById('options-container');
    const promptElement = document.getElementById('question-prompt');

    let selectedOperation = 'Addition';
    let selectedLevel = 1;
    let selectedNumQuestions = 1;
    let currentQuestion = null;
    let mixedQuestions = [];

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
        } else {
            // Select the first provider by default
            const firstProviderButton = providerButtons[0];
            if (firstProviderButton) {
                selectedOperation = firstProviderButton.textContent.trim();
                firstProviderButton.classList.add('active', 'bg-blue-500', 'text-white');
                firstProviderButton.classList.remove('bg-gray-200');
            }
        }

        if (savedLevel && !isNaN(savedLevel)) {
            selectedLevel = parseInt(savedLevel);
            const levelButton = document.querySelector(`.level-btn:nth-child(${selectedLevel})`);
            if (levelButton) {
                levelButton.classList.add('active', 'bg-blue-500', 'text-white');
                levelButton.classList.remove('bg-gray-200');
            }
        } else {
            // Select the first level by default
            const firstLevelButton = levelButtons[0];
            if (firstLevelButton) {
                selectedLevel = parseInt(firstLevelButton.textContent.trim().split(' ')[1]);
                firstLevelButton.classList.add('active', 'bg-blue-500', 'text-white');
                firstLevelButton.classList.remove('bg-gray-200');
            }
        }

        if (savedNumQuestions && !isNaN(savedNumQuestions)) {
            selectedNumQuestions = parseInt(savedNumQuestions);
            const numQuestionsButton = document.querySelector(`.num-btn:nth-child(${selectedNumQuestions})`);
            if (numQuestionsButton) {
                numQuestionsButton.classList.add('active', 'bg-blue-500', 'text-white');
                numQuestionsButton.classList.remove('bg-gray-200');
            }
        } else {
            // Select the first number of questions by default
            const firstNumQuestionsButton = questionButtons[0];
            if (firstNumQuestionsButton) {
                selectedNumQuestions = parseInt(firstNumQuestionsButton.textContent.trim());
                firstNumQuestionsButton.classList.add('active', 'bg-blue-500', 'text-white');
                firstNumQuestionsButton.classList.remove('bg-gray-200');
            }
        }

        if (selectedOperation !== null && selectedLevel !== null && selectedNumQuestions !== null) {
            startTestBtn.disabled = false;
        }
    }

    function saveSelections() {
        localStorage.setItem('selectedOperation', selectedOperation);
        localStorage.setItem('selectedLevel', selectedLevel);
        localStorage.setItem('selectedNumQuestions', selectedNumQuestions);
    }

    function handleProviderToggle(operationName, button) {
        if (selectedOperation === operationName) {
            selectedOperation = null;
            button.classList.remove('active', 'bg-blue-500', 'text-white');
            button.classList.add('bg-gray-200');
        } else {
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

        if (selectedOperation !== null && selectedLevel !== null && selectedNumQuestions !== null) {
            startTestBtn.disabled = false;
        } else {
            startTestBtn.disabled = true;
        }

        saveSelections();
    }

    providerButtons.forEach(button => {
        button.addEventListener('click', () => {
            const operationName = button.textContent.trim();
            handleProviderToggle(operationName, button);
        });
    });

    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            levelButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-blue-500', 'text-white');
                btn.classList.add('bg-gray-200');
            });

            button.classList.add('active', 'bg-blue-500', 'text-white');
            button.classList.remove('bg-gray-200');

            selectedLevel = parseInt(button.textContent.trim().split(' ')[1]);

            if (selectedOperation !== null && selectedLevel !== null && selectedNumQuestions !== null) {
                startTestBtn.disabled = false;
            } else {
                startTestBtn.disabled = true;
            }

            saveSelections();
        });

        button.addEventListener('focusout', () => {
            if (button.classList.contains('active')) {
                button.classList.add('bg-blue-500', 'text-white');
            }
        });
    });

    questionButtons.forEach(button => {
        button.addEventListener('click', () => {
            questionButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-blue-500', 'text-white');
                btn.classList.add('bg-gray-200');
            });

            button.classList.add('active');
            button.classList.remove('bg-gray-200');
            button.classList.add('bg-blue-500', 'text-white');

            selectedNumQuestions = parseInt(button.textContent.trim());

            if (selectedOperation !== null && selectedLevel !== null && selectedNumQuestions !== null) {
                startTestBtn.disabled = false;
            } else {
                startTestBtn.disabled = true;
            }

            saveSelections();
        });

        button.addEventListener('focusout', () => {
            if (button.classList.contains('active')) {
                button.classList.add('bg-blue-500', 'text-white');
            }
        });
    });

    loadSelections();

    function endTest() {
        questionScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        footerSlogan.classList.remove('hidden');
        endTestBtn.classList.add('hidden');
        currentQuestion = null;
        mixedQuestions = [];
        loadSelections();
        animationContainer.innerHTML = '';
        optionsContainer.innerHTML = '';
        promptElement.textContent = 'Loading question...';
    }

    function startTest() {
        if (selectedOperation === null || selectedLevel === null || selectedNumQuestions === null) {
            alert('Please select an operation, a level, and the number of questions.');
            return;
        }

        const activeProviders = providers.filter(p => p.name === selectedOperation);

        if (activeProviders.length === 0) {
            console.error(`No providers selected.`);
            return;
        }

        activeProviders.forEach(provider => provider.setLevel(selectedLevel));

        mixedQuestions = [];
        for (let i = 0; i < selectedNumQuestions; i++) {
            const randomProvider = activeProviders[Math.floor(Math.random() * activeProviders.length)];
            const question = randomProvider.generateQuestion();
            mixedQuestions.push(question);
        }

        startScreen.classList.add('hidden');
        questionScreen.classList.remove('hidden');
        footerSlogan.classList.add('hidden');
        endTestBtn.classList.remove('hidden');

        let currentQuestionIndex = 0;

        function loadQuestion() {
            animationContainer.innerHTML = '';

            if (currentQuestionIndex >= mixedQuestions.length) {
                endTest();
                return;
            }

            currentQuestion = mixedQuestions[currentQuestionIndex];
            promptElement.textContent = currentQuestion.prompt;
            optionsContainer.innerHTML = '';

            currentQuestion.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option.text;
                button.value = option.value;
                button.className = 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition';
                button.addEventListener('click', handleOptionClick);
                optionsContainer.appendChild(button);
            });
        }

        function handleOptionClick(event) {
            const selectedValue = parseInt(event.target.value);
            const isCorrect = selectedValue === currentQuestion.correctAnswer;

            if (isCorrect) {
                showAnimation('correct');
                setTimeout(() => {
                    currentQuestionIndex += 1;
                    if (currentQuestionIndex < mixedQuestions.length) {
                        loadQuestion();
                    } else {
                        endTest();
                    }
                }, 1000);
            } else {
                showAnimation('wrong');
            }
        }

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

            animationContainer.appendChild(animationMsg);

            setTimeout(() => {
                animationContainer.removeChild(animationMsg);
            }, 1000);
        }

        loadQuestion();
    }

    if (startTestBtn) {
        startTestBtn.addEventListener('click', startTest);
    }

    if (endTestBtn) {
        endTestBtn.addEventListener('click', endTest);
    }
}
