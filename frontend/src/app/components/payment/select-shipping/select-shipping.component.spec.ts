import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectShippingComponent } from './select-shipping.component';

describe('SelectShippingComponent', () => {
  let component: SelectShippingComponent;
  let fixture: ComponentFixture<SelectShippingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectShippingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
