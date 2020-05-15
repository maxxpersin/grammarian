import { Font } from '../font/font';
import { Level } from '../level/level';
import { Colors } from '../colors/colors';

export class Defaults {
    font: Font;
    level: Level;
    colors: Colors;

    constructor(f: Font, l: Level, c: Colors) {
        this.font = f;
        this.level = l;
        this.colors = c;
    }
}
