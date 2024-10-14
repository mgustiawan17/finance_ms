import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratIzinListComponent } from './surat-izin-list.component';

describe('SuratIzinListComponent', () => {
  let component: SuratIzinListComponent;
  let fixture: ComponentFixture<SuratIzinListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuratIzinListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuratIzinListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
