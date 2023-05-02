export class User {
    name: string = '';
    password: string = '';
    mail: string = '';
    id: string = '';



    constructor(obj?: any) {
    this.name = obj ? obj.name : '';
    this.password = obj ? obj.password : '';
    this.mail = obj ? obj.mail : '';
    this.id = obj ? obj.id : '';

      
    }

    public toJSON() {
        return {
            name: this.name,
            password: this.password,
            mail: this.mail,
            id: this.id
        };
    }

}