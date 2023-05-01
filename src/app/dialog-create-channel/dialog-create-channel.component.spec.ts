import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateChannelComponent } from './dialog-create-channel.component';

describe('DialogCreateChannelComponent', () => {
  let component: DialogCreateChannelComponent;
  let fixture: ComponentFixture<DialogCreateChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreateChannelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCreateChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
