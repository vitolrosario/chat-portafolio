import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirusGameComponent } from './virus-game.component';

describe('VirusGameComponent', () => {
  let component: VirusGameComponent;
  let fixture: ComponentFixture<VirusGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VirusGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VirusGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
