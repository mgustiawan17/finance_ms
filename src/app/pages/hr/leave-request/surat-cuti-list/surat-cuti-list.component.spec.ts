import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratCutiListComponent } from './surat-cuti-list.component';

describe('SuratCutiListComponent', () => {
  let component: SuratCutiListComponent;
  let fixture: ComponentFixture<SuratCutiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuratCutiListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuratCutiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
