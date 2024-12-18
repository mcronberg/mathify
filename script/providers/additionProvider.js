import { MathProvider } from './mathProvider.js';

export class AdditionProvider extends MathProvider {
    constructor(level = 1) {
        super(level);
        this.name = 'Addition'; // Set provider name
        this.levelRanges = {
            1: { min: 1, max: 10, operandsRange: { min: 2, max: 2 } },
            2: { min: 1, max: 50, operandsRange: { min: 2, max: 3 } },
            3: { min: 50, max: 250, operandsRange: { min: 2, max: 4 } }
        };
        this.range = this.levelRanges[level];
    }

    #generateAnswerOptions(correctAnswer) {
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
        const { min, max, operandsRange } = this.range;
        const numOperands = operandsRange.min === operandsRange.max 
            ? operandsRange.min 
            : Math.floor(Math.random() * (operandsRange.max - operandsRange.min + 1)) + operandsRange.min;

        const numbers = [];
        let answer = 0;
        for (let i = 0; i < numOperands; i++) {
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            numbers.push(num);
            answer += num;
        }

        return {
            id: crypto.randomUUID(),
            numbers, // Array of operands
            prompt: `What is ${numbers.join(' + ')}?`,
            correctAnswer: answer,
            options: this.#generateAnswerOptions(answer),
            validate: (userAnswer) => parseInt(userAnswer) === answer,
            level: this.level
        };
    }

    setLevel(level) {
        if (this.levelRanges[level]) {
            this.level = level;
            this.range = this.levelRanges[level];
        }
    }
}
