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
        console.log(`Subtraction Level: ${this.level}, Range: ${min} - ${max}`);

        const numbers = [];
        let x = Math.floor(Math.random() * (max - min + 1)) + min;
        let y = Math.floor(Math.random() * (max - min + 1)) + min;
        if (this.level === 1) {
            if (x < y) {
                [x, y] = [y, x];
            }
        }
        numbers.push(x);
        numbers.push(y);
        let answer = x - y;
        console.log(`Generated Subtraction Question: ${numbers.join(' - ')} = ${answer}`);

        let options = [];
        if (this.level === 1) {
            options.push({ text: answer.toString(), value: answer, isCorrect: true });

            let count = 0;
            while (count < 3) {
                let randomNumber = this.generateRandomNumber(-3, 3);
                if (randomNumber + answer !== answer && !options.find(option => option.value === (answer + randomNumber))) {
                    options.push({ text: (answer + randomNumber).toString(), value: answer + randomNumber, isCorrect: false });
                    count++;
                }
            }
        }

        if (this.level === 2) {
            options.push({ text: answer.toString(), value: answer, isCorrect: true });

            let count = 0;
            while (count < 3) {
                let randomNumber = this.generateRandomNumber(-10, 10);
                if (randomNumber + answer !== answer && !options.find(option => option.value === (answer + randomNumber))) {
                    options.push({ text: (answer + randomNumber).toString(), value: answer + randomNumber, isCorrect: false });
                    count++;
                }
            }
        }

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