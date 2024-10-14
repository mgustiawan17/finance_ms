import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratDinasListComponent } from './surat-dinas-list.component';

describe('SuratDinasListComponent', () => {
  let component: SuratDinasListComponent;
  let fixture: ComponentFixture<SuratDinasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuratDinasListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuratDinasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
