export class Level {
    rounds: number;
    maxLength: number;
    minLength: number;
    name: string;

    constructor(r: number, max: number, min: number, n: string) {
        this.rounds = r;
        this.maxLength = max;
        this.minLength = min;
        this.name = n;
    }
}
