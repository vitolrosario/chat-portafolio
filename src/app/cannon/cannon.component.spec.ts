import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CannonComponent } from './cannon.component';

describe('CannonComponent', () => {
  let component: CannonComponent;
  let fixture: ComponentFixture<CannonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CannonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CannonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
