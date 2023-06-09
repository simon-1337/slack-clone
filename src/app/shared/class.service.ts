import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  menuCollapsed: boolean = true;
  private hideSidenav = false;

  get hideSidenavClass(): boolean {
    return this.hideSidenav;
  }

  set hideSidenavClass(value: boolean) {
    this.hideSidenav = value;
  }

  closeMenu() {
    this.hideSidenavClass = !this.hideSidenavClass;
    this.menuCollapsed = !this.menuCollapsed;
  }
}
