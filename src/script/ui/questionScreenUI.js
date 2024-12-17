export function initQuestionScreenUI(providers, endTest) {
    const questionScreen = document.getElementById('question-screen');
    const startScreen = document.getElementById('start-screen');
    const footerSlogan = document.getElementById('footer-slogan');
    const endTestBtn = document.getElementById('end-test-btn');
    const animationContainer = document.getElementById('animation-container');
    const optionsContainer = document.getElementById('options-container');
    const promptElement = document.getElementById('question-prompt');

    let currentQuestion = null;
    let mixedQuestions = [];

    function startTest(selectedOperation, selectedLevel, selectedNumQuestions) {
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

    if (endTestBtn) {
        endTestBtn.addEventListener('click', endTest);
    }

    return startTest;
}
