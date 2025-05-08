import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturexternComponent } from './returextern.component';

describe('ReturexternComponent', () => {
  let component: ReturexternComponent;
  let fixture: ComponentFixture<ReturexternComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturexternComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReturexternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
