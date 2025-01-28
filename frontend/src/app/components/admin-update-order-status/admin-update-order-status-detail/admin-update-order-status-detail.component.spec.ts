import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateOrderStatusDetailComponent } from './admin-update-order-status-detail.component';

describe('AdminUpdateOrderStatusDetailComponent', () => {
  let component: AdminUpdateOrderStatusDetailComponent;
  let fixture: ComponentFixture<AdminUpdateOrderStatusDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUpdateOrderStatusDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUpdateOrderStatusDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
