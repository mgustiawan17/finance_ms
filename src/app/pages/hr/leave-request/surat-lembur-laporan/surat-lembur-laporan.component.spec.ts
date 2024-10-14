import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratLemburLaporanComponent } from './surat-lembur-laporan.component';

describe('SuratLemburLaporanComponent', () => {
  let component: SuratLemburLaporanComponent;
  let fixture: ComponentFixture<SuratLemburLaporanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuratLemburLaporanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuratLemburLaporanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
