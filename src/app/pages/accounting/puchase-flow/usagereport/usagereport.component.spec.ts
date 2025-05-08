import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsagereportComponent } from './usagereport.component';

describe('UsagereportComponent', () => {
  let component: UsagereportComponent;
  let fixture: ComponentFixture<UsagereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsagereportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsagereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
