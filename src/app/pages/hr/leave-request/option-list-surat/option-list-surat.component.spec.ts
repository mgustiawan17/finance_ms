import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionListSuratComponent } from './option-list-surat.component';

describe('OptionListSuratComponent', () => {
  let component: OptionListSuratComponent;
  let fixture: ComponentFixture<OptionListSuratComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionListSuratComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OptionListSuratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
