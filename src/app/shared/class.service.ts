import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private hideSidenav = false;
  private sidenavClass = '';

  get hideSidenavClass(): boolean {
    return this.hideSidenav;
  }

  set hideSidenavClass(value: boolean) {
    this.hideSidenav = value;
    this.sidenavClass = value ? 'hide-sidenav' : '';
  }

  getSidenavClass(): string {
    return this.sidenavClass;
  }

  setHideSidenavClass(value: boolean) {
    this.hideSidenav = value;
    this.sidenavClass = value ? 'hide-sidenav' : '';
  }
}
