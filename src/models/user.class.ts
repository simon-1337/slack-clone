export class User {
    name: string = '';
    mail: string = '';
    password: string = '';
    profileImageUrl?: string;
  
    constructor(obj?: any) {
      this.name = obj ? obj.name : '';
      this.password = obj ? obj.password : '';
      this.mail = obj ? obj.mail : '';
      this.profileImageUrl = obj ? obj.profileImageUrl : '';
    }
  
    public toJSON() {
      return {
        name: this.name,
        password: this.password,
        mail: this.mail,
        profileImageUrl: this.profileImageUrl
      };
    }
  }