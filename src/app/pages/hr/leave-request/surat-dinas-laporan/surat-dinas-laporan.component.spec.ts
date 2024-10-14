import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratDinasLaporanComponent } from './surat-dinas-laporan.component';

describe('SuratDinasLaporanComponent', () => {
  let component: SuratDinasLaporanComponent;
  let fixture: ComponentFixture<SuratDinasLaporanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuratDinasLaporanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuratDinasLaporanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
