import { Colors } from '../colors/colors';
import { Font } from '../font/font';
import { Level } from '../level/level';

export class Game {
    userId: string;
    colors: Colors;
    font: Font;
    guesses: string;
    _id: string;
    level: Level;
    remaining: number;
    status: string;
    target: string;
    timeStamp: number;
    timeToComplete: number;
    view: string;

    constructor(u: string, c: Colors, f: Font, g: string,
        i: string, l: Level, r: number, target: string, timeS: number,
        timeT: number, v: string) {
        this.userId = u;
        this.colors = c;
        this.font = f;
        this.guesses = g;
        this._id = i;
        this.level = l;
        this.remaining = r;
        this.target = target;
        this.timeStamp = timeS;
        this.timeToComplete = timeT;
        this.view = v;
    }
}
