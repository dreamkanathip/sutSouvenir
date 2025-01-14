import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateOrderStatusComponent } from './admin-update-order-status.component';

describe('AdminUpdateOrderStatusComponent', () => {
  let component: AdminUpdateOrderStatusComponent;
  let fixture: ComponentFixture<AdminUpdateOrderStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUpdateOrderStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUpdateOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
