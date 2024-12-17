import { MathProvider } from './mathProvider.js';

export class SubtractionProvider extends MathProvider {
    constructor(level = 1) {
        super(level);
        this.name = 'Subtraction'; // Set provider name
        this.levelRanges = {
            1: { min: 1, max: 10, operandsRange: { min: 2, max: 2 } },
            2: { min: 10, max: 50, operandsRange: { min: 2, max: 3 } },
            3: { min: 50, max: 100, operandsRange: { min: 2, max: 4 } }
        };
        this.range = this.levelRanges[level];
    }

    generateQuestion() {
        const { min, max, operandsRange } = this.range;
        const numOperands = operandsRange.min === operandsRange.max
            ? operandsRange.min
            : Math.floor(Math.random() * (operandsRange.max - operandsRange.min + 1)) + operandsRange.min;

        const numbers = [];
        let answer = Math.floor(Math.random() * (max - min + 1)) + min;
        numbers.push(answer);

        for (let i = 1; i < numOperands; i++) {
            const num = Math.floor(Math.random() * (answer - min + 1)) + min;
            numbers.push(num);
            answer -= num;
        }

        return {
            id: crypto.randomUUID(),
            numbers,
            prompt: `What is ${numbers.join(' - ')}?`,
            correctAnswer: answer,
            options: this.generateAnswerOptions(answer),
            validate: (userAnswer) => parseInt(userAnswer) === answer,
            level: this.level
        };
    }
}