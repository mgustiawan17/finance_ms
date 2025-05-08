import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckkontrabonComponent } from './checkkontrabon.component';

describe('CheckkontrabonComponent', () => {
  let component: CheckkontrabonComponent;
  let fixture: ComponentFixture<CheckkontrabonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckkontrabonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckkontrabonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
