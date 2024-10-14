import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratIzinLaporanComponent } from './surat-izin-laporan.component';

describe('SuratIzinLaporanComponent', () => {
  let component: SuratIzinLaporanComponent;
  let fixture: ComponentFixture<SuratIzinLaporanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuratIzinLaporanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuratIzinLaporanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
