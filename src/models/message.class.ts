import { Answer } from './answer.class';

export class Message {
    message: string;
    // author: string;
    // answers: Answer[];

    constructor(obj?: any) {
        this.message = obj ? obj.message : '';
        // this.author = obj ? obj.author : '';
        // this.answers = obj ? obj.answers : [];
    }

    public toJSON() {
        return {
            message: this.message,
            // author: this.author,
            // answers: this.answers.map(answer => answer.toJSON())
        };
    }
}