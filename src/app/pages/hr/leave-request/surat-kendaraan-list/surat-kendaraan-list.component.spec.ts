import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratKendaraanListComponent } from './surat-kendaraan-list.component';

describe('SuratKendaraanListComponent', () => {
  let component: SuratKendaraanListComponent;
  let fixture: ComponentFixture<SuratKendaraanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuratKendaraanListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuratKendaraanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
