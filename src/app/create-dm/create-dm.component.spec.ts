import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDmComponent } from './create-dm.component';

describe('CreateDmComponent', () => {
  let component: CreateDmComponent;
  let fixture: ComponentFixture<CreateDmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
