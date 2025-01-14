import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShippingComponent } from './add-shipping.component';

describe('AddShippingComponent', () => {
  let component: AddShippingComponent;
  let fixture: ComponentFixture<AddShippingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddShippingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
