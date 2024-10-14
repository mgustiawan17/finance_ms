import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratLemburListComponent } from './surat-lembur-list.component';

describe('SuratLemburListComponent', () => {
  let component: SuratLemburListComponent;
  let fixture: ComponentFixture<SuratLemburListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuratLemburListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuratLemburListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
