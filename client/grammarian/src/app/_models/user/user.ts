import { Defaults } from '../defaults/defaults';

export class User {
    _id: string;
    email: string;
    defaults: Defaults;

    constructor(id: string, e: string, d: Defaults) {
        this._id = id;
        this.email = e;
        this.defaults = d;
    }
}
