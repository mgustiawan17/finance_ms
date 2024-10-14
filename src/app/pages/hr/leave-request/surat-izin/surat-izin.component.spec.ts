import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratIzinComponent } from './surat-izin.component';

describe('SuratIzinComponent', () => {
  let component: SuratIzinComponent;
  let fixture: ComponentFixture<SuratIzinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuratIzinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuratIzinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
