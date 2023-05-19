import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenThreadService {
  private threadOpenedSource = new BehaviorSubject<{ isOpen: boolean, channelId: any, messageId: any}>({
    isOpen: false,
    channelId: null,
    messageId: null,
  });

  threadOpened$ = this.threadOpenedSource.asObservable();

  setThreadOpened(isOpen: boolean, channelId: any, messageId: any): void {
    this.threadOpenedSource.next({ isOpen, channelId, messageId });
  }
}