export class Font {
    category: string;
    family: string;
    rule: string;
    url: string;

    constructor(c: string, f: string, r: string, u: string) {
        this.category = c;
        this.family = f;
        this.rule = r;
        this.url = u;
    }
}
