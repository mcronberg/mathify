export function createTest(providers, selectedOperation, selectedLevel, selectedNumQuestions) {
    const activeProviders = providers.filter(p => p.name === selectedOperation);

    if (activeProviders.length === 0) {
        console.error(`No providers selected.`);
        return [];
    }

    activeProviders.forEach(provider => provider.setLevel(selectedLevel));

    const mixedQuestions = [];
    for (let i = 0; i < selectedNumQuestions; i++) {
        const randomProvider = activeProviders[Math.floor(Math.random() * activeProviders.length)];
        const question = randomProvider.generateQuestion();
        mixedQuestions.push(question);
    }

    return mixedQuestions;
}
