import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportbtbComponent } from './reportbtb.component';

describe('ReportbtbComponent', () => {
  let component: ReportbtbComponent;
  let fixture: ComponentFixture<ReportbtbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportbtbComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportbtbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
