export class MathProvider {
    constructor(level = 1) {
        this.level = level;
        this.name = 'BaseProvider'; // Added name property
        this.levelRanges = {}; // To be defined in subclasses
        this.range = this.levelRanges[level];
    }

    generateAnswerOptions(correctAnswer) {
        const options = new Set();
        const variance = Math.ceil(correctAnswer * 0.1); // 10% variance
        const min = Math.max(1, correctAnswer - variance * 2);
        const max = correctAnswer + variance * 2;

        // Add correct answer
        options.add(correctAnswer);

        // Generate a pool of possible wrong answers
        const possibleWrongAnswers = [];
        for (let i = min; i <= max; i++) {
            if (i !== correctAnswer) {
                possibleWrongAnswers.push(i);
            }
        }

        // Shuffle the possible wrong answers
        for (let i = possibleWrongAnswers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [possibleWrongAnswers[i], possibleWrongAnswers[j]] = [possibleWrongAnswers[j], possibleWrongAnswers[i]];
        }

        // Add wrong answers until we have 4 options
        for (const value of possibleWrongAnswers) {
            if (options.size >= 4) break;
            if (value > 0) {
                options.add(value);
            }
        }

        // If not enough options, expand the range further
        let extendedVariance = variance * 3;
        while (options.size < 4 && extendedVariance <= this.range.max) {
            const newMin = Math.max(1, correctAnswer - extendedVariance);
            const newMax = correctAnswer + extendedVariance;
            for (let i = newMin; i <= newMax; i++) {
                if (i !== correctAnswer && !options.has(i) && i > 0) {
                    options.add(i);
                    if (options.size === 4) break;
                }
            }
            extendedVariance += variance;
        }

        // Format options
        const formattedOptions = Array.from(options)
            .map(value => ({
                text: value.toString(),
                value: value,
                isCorrect: value === correctAnswer
            }))
            .sort(() => Math.random() - 0.5); // Shuffle

        return formattedOptions;
    }

    generateQuestion() {
        throw new Error('generateQuestion() must be implemented by subclasses');
    }

    setLevel(level) {
        if (this.levelRanges[level]) {
            this.level = level;
            this.range = this.levelRanges[level];
        }
    }
}