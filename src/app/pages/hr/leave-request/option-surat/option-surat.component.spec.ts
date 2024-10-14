import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionSuratComponent } from './option-surat.component';

describe('OptionSuratComponent', () => {
  let component: OptionSuratComponent;
  let fixture: ComponentFixture<OptionSuratComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionSuratComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OptionSuratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
