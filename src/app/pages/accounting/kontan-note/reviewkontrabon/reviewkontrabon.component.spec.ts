import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewkontrabonComponent } from './reviewkontrabon.component';

describe('ReviewkontrabonComponent', () => {
  let component: ReviewkontrabonComponent;
  let fixture: ComponentFixture<ReviewkontrabonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewkontrabonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewkontrabonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
