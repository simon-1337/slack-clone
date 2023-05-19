import { Component, ViewChild } from '@angular/core';
import { ChannelComponent } from '../channel/channel.component';
import { OpenThreadService } from '../shared/open-thread.service';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {
  threadOpened: boolean = false;
  messageId: number;
  channelId: number;

  constructor(private openThreadService: OpenThreadService) {}

  ngOnInit(): void {
    this.openThreadService.threadOpened$.subscribe(({ isOpen, channelId, messageId}) => {
      // Perform actions based on the received values
      if (isOpen) {
        this.threadOpened = isOpen;
        this.messageId = messageId;
        this.channelId = channelId;
        console.log('test: ', messageId);        
      } else {
        this.threadOpened = false;
      }
    });
  }
}
