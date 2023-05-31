export class Dm {
    participants: any;

    constructor(obj?: any) {
        this.participants = obj ? obj.participants : '';
    }

    public toJSON() {
        return {
            participants: this.participants
        };
    }
}