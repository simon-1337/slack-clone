export class Answer {
    text: string;
    user: string;
  
    constructor(text: string, user: string) {
      this.text = text;
      this.user = user;
    }
  
    public toJSON() {
      return {
        text: this.text,
        user: this.user
      };
    }
  }