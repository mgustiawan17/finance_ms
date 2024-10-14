import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratLemburComponent } from './surat-lembur.component';

describe('SuratLemburComponent', () => {
  let component: SuratLemburComponent;
  let fixture: ComponentFixture<SuratLemburComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuratLemburComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuratLemburComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
