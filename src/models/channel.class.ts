import { Message } from './message.class';

export class Channel {
    channelName: string;
    messages: Message[];
  
    constructor(obj?: any) {
      this.channelName = obj ? obj.channelName : '';
      this.messages = obj && obj.messages ? obj.messages.map(messageObj => new Message(messageObj)) : [];
    }
  
    public toJSON() {
      return {
        channelName: this.channelName,
        messages: this.messages.map(message => message.toJSON()) // Maps each message in the messages array to its JSON representation.
      };
    }
  }