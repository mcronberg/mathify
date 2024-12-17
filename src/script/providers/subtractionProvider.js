import { MathProvider } from './mathProvider.js';

export class SubtractionProvider extends MathProvider {
    constructor(level = 1) {
        super(level);
        this.name = 'Subtraction'; // Set provider name
        this.levelRanges = {
            1: { min: 1, max: 10 },
            2: { min: 10, max: 50 },
            3: { min: 50, max: 100 }
        };
        this.range = this.levelRanges[level];
    }

    generateQuestion() {
        const { min, max } = this.range;

        const numbers = [];
        let x = Math.floor(Math.random() * (max - min + 1)) + min;
        numbers.push(x);
        let y = Math.floor(Math.random() * (max - min + 1)) + min;
        numbers.push(y);
        let answer = x - y;
        console.log(`Generated Subtraction Question: ${numbers.join(' - ')} = ${answer}`);

        let options = [{ text: answer.toString(), value: answer, isCorrect: true },
        { text: (answer + 1).toString(), value: answer + 1, isCorrect: false },
        { text: (answer - 1).toString(), value: answer - 1, isCorrect: false },
        { text: (answer + 2).toString(), value: answer + 2, isCorrect: false }

        ];
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        return {
            id: crypto.randomUUID(),
            numbers,
            prompt: `What is ${numbers.join(' - ')}?`,
            correctAnswer: answer,
            options: options,
            level: this.level
        };
    }
}