import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratKendaraanComponent } from './surat-kendaraan.component';

describe('SuratKendaraanComponent', () => {
  let component: SuratKendaraanComponent;
  let fixture: ComponentFixture<SuratKendaraanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuratKendaraanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuratKendaraanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
