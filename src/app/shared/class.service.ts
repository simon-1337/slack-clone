import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  menuCollapsed: boolean = true;
  channelIsOpen: boolean = false;
 
  private hideSidenav = false;

  get hideSidenavClass(): boolean {
    return this.hideSidenav;
  }

  set hideSidenavClass(value: boolean) {
    this.hideSidenav = value;
  }

  closeMenu() {
    if (innerWidth < 600) {
      this.toggle();
    }
    // this.channelIsOpen = true;
    // this.threadIsOpen = false;
  }


  toggle() {
    this.hideSidenavClass = !this.hideSidenavClass;
    this.menuCollapsed = !this.menuCollapsed;
    // if (innerWidth <= 1200 && this.threadIsOpen && this.channelIsOpen) {
    //   this.threadIsOpen = false;
    // }
  }
}
