import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListkontrabonComponent } from './listkontrabon.component';

describe('ListkontrabonComponent', () => {
  let component: ListkontrabonComponent;
  let fixture: ComponentFixture<ListkontrabonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListkontrabonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListkontrabonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
