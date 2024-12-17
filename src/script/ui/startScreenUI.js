export function initStartScreenUI(settings, providers, startTest) {
    const startScreen = document.getElementById('start-screen');
    const startTestBtn = document.getElementById('start-test-btn');
    const providerButtons = document.querySelectorAll('.provider-btn');
    const levelButtons = document.querySelectorAll('.level-btn');
    const questionButtons = document.querySelectorAll('.num-btn');

    let selectedOperation = null;
    let selectedLevel = null;
    let selectedNumQuestions = null;

    function clearSelections() {
        providerButtons.forEach(button => {
            button.classList.remove('active', 'bg-blue-500', 'text-white');
            button.classList.add('bg-gray-200');
        });
        levelButtons.forEach(button => {
            button.classList.remove('active', 'bg-blue-500', 'text-white');
            button.classList.add('bg-gray-200');
        });
        questionButtons.forEach(button => {
            button.classList.remove('active', 'bg-blue-500', 'text-white');
            button.classList.add('bg-gray-200');
        });
    }

    function loadSelections() {
        const savedOperation = localStorage.getItem('selectedOperation');
        const savedLevel = localStorage.getItem('selectedLevel');
        const savedNumQuestions = localStorage.getItem('selectedNumQuestions');

        clearSelections();

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
            const levelButton = levelButtons[savedLevel - 1];
            if (levelButton) {
                levelButton.classList.add('active', 'bg-blue-500', 'text-white');
                levelButton.classList.remove('bg-gray-200');
            }
        } else {
            // Select the first level by default
            const firstLevelButton = levelButtons[0];
            if (firstLevelButton) {
                selectedLevel = 1;
                firstLevelButton.classList.add('active', 'bg-blue-500', 'text-white');
                firstLevelButton.classList.remove('bg-gray-200');
            }
        }

        if (savedNumQuestions && !isNaN(savedNumQuestions)) {
            selectedNumQuestions = parseInt(savedNumQuestions);
            const numQuestionsButton = questionButtons[savedNumQuestions - 1];
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
            return; // Prevent deselecting the current operation
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

            selectedLevel = parseInt(button.textContent);

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

    if (startTestBtn) {
        startTestBtn.addEventListener('click', () => {
            console.log(selectedOperation, selectedLevel, selectedNumQuestions);
            startTest(selectedOperation, selectedLevel, selectedNumQuestions);
        });
    }
}
