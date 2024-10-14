import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SisaCutiComponent } from './sisa-cuti.component';

describe('SisaCutiComponent', () => {
  let component: SisaCutiComponent;
  let fixture: ComponentFixture<SisaCutiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SisaCutiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SisaCutiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
