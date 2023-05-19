import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenedThreadComponent } from './opened-thread.component';

describe('OpenedThreadComponent', () => {
  let component: OpenedThreadComponent;
  let fixture: ComponentFixture<OpenedThreadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenedThreadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenedThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
