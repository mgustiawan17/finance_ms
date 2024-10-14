import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratCutiComponent } from './surat-cuti.component';

describe('SuratCutiComponent', () => {
  let component: SuratCutiComponent;
  let fixture: ComponentFixture<SuratCutiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuratCutiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuratCutiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
