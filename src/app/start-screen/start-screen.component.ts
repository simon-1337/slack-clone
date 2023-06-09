import { Component, ViewChild } from '@angular/core';
import { ChannelComponent } from '../channel/channel.component';
import { OpenThreadService } from '../shared/open-thread.service';
import { ClassService } from '../shared/class.service';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {
  threadOpened: boolean = false;
  messageId: number;
  channelId: number;
  containerVisible: boolean = true;
 

  constructor(private openThreadService: OpenThreadService, public classService: ClassService) {}

  ngOnInit(): void {
    this.openThreadService.threadOpened$.subscribe(({ isOpen, channelId, messageId}) => {
      // Perform actions based on the received values
      if (isOpen) {
        this.messageId = messageId;
        this.channelId = channelId;  
        this.threadOpened = isOpen;
      } else {
        this.threadOpened = false;
      }
    });
  }
}
