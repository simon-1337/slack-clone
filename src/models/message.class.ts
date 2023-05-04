export class Message {
    message: string;
    user: string;
    timestamp: number 

    constructor(obj?: any) {
        this.message = obj ? obj.message : '';
        this.user = obj ? obj.user : 'GuestUser';
        this.timestamp = obj ? obj.timestamp : Date.now();
    }

    public toJSON() {
        return {
            message: this.message,
            user: this.user,
            timestamp: this.timestamp,
        };
    }
}