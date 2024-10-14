import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratCutiLaporanComponent } from './surat-cuti-laporan.component';

describe('SuratCutiLaporanComponent', () => {
  let component: SuratCutiLaporanComponent;
  let fixture: ComponentFixture<SuratCutiLaporanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuratCutiLaporanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuratCutiLaporanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
