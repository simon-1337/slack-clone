import { Message } from './message.class';

export class Channel {
    channelName: string;
  
    constructor(obj?: any) {
      this.channelName = obj ? obj.channelName : '';
    }
  
    public toJSON() {
      return {
        channelName: this.channelName,
      };
    }
  }