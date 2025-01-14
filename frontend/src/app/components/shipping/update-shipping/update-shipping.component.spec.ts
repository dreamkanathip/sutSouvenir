import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateShippingComponent } from './update-shipping.component';

describe('UpdateShippingComponent', () => {
  let component: UpdateShippingComponent;
  let fixture: ComponentFixture<UpdateShippingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateShippingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
