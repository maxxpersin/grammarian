import { Font } from '../font/font';
import { Level } from '../level/level';
import { Colors } from '../colors/colors';
import { Defaults } from '../defaults/defaults';

export class Metadata {
    fonts: Font[];
    levels: Level[];
    default: Defaults;

    constructor(f: Font[], l: Level[], d: Defaults) {
        this.fonts = f;
        this.levels = l;
        this.default = d;
    }
}
