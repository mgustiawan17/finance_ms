import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturkontrabonComponent } from './returkontrabon.component';

describe('ReturkontrabonComponent', () => {
  let component: ReturkontrabonComponent;
  let fixture: ComponentFixture<ReturkontrabonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturkontrabonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReturkontrabonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
