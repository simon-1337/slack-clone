import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
 
  private hideSidenav = false;

  get hideSidenavClass(): boolean {
    return this.hideSidenav;
  }

  set hideSidenavClass(value: boolean) {
    
    this.hideSidenav = value;
  }
}
