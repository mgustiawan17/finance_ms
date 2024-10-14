import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionLaporanSuratComponent } from './option-laporan-surat.component';

describe('OptionLaporanSuratComponent', () => {
  let component: OptionLaporanSuratComponent;
  let fixture: ComponentFixture<OptionLaporanSuratComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionLaporanSuratComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OptionLaporanSuratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
