import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturinternComponent } from './returintern.component';

describe('ReturinternComponent', () => {
  let component: ReturinternComponent;
  let fixture: ComponentFixture<ReturinternComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturinternComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReturinternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
