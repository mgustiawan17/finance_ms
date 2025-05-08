import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksparepartComponent } from './stocksparepart.component';

describe('StocksparepartComponent', () => {
  let component: StocksparepartComponent;
  let fixture: ComponentFixture<StocksparepartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StocksparepartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StocksparepartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
