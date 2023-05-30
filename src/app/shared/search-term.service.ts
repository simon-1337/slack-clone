import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class SearchTermService {
  

  @Output() searchTermChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }
}
