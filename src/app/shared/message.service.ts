import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class MessageService {
  private messageAddedSource = new Subject<void>();

  messageAdded$ = this.messageAddedSource.asObservable();

  announceMessageAdded() {
    this.messageAddedSource.next();
  }
}