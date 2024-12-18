import { MathProvider } from './mathProvider.js';

export class MultiplicationProvider extends MathProvider {
    constructor(level = 1) {
        super(level);
        this.name = 'Multiplication'; // Set provider name
        this.levelRanges = {
            1: { min: 1, max: 10 },
            2: { min: 10, max: 20 },
            3: { min: 20, max: 50 }
        };
        this.range = this.levelRanges[level];
    }

    generateQuestion() {
        const { min, max } = this.range;
        console.log(`Multiplication Level: ${this.level}, Range: ${min} - ${max}`);

        const x = Math.floor(Math.random() * (max - min + 1)) + min;
        const y = Math.floor(Math.random() * (max - min + 1)) + min;
        const answer = x * y;

        console.log(`Generated Multiplication Question: ${x} * ${y} = ${answer}`);

        let options = [];
        options.push({ text: answer.toString(), value: answer, isCorrect: true });

        let count = 0;
        while (count < 3) {
            let randomNumber = this.generateRandomNumber(-10, 10);
            if (randomNumber + answer !== answer && !options.find(option => option.value === (answer + randomNumber))) {
                options.push({ text: (answer + randomNumber).toString(), value: answer + randomNumber, isCorrect: false });
                count++;
            }
        }

        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        return {
            id: crypto.randomUUID(),
            numbers: [x, y],
            prompt: `What is ${x} * ${y}?`,
            correctAnswer: answer,
            options: options,
            level: this.level
        };
    }
}
