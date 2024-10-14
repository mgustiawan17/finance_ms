import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratDinasComponent } from './surat-dinas.component';

describe('SuratDinasComponent', () => {
  let component: SuratDinasComponent;
  let fixture: ComponentFixture<SuratDinasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuratDinasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuratDinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
