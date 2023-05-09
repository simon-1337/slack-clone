export class Message {
    message: string;
    user: string;
    timestamp: number;
    imagePath: string; 

    constructor(obj?: any) {
        this.message = obj ? obj.message : '';
        this.user = obj ? obj.user : 'GuestUser';
        this.timestamp = obj ? obj.timestamp : Date.now();
        this.imagePath = obj ? obj.imagePath : '/assets/img/avatar.png'
    }

    public toJSON() {
        return {
            message: this.message,
            user: this.user,
            timestamp: this.timestamp,
            imagePath: this.imagePath
        };
    }
}