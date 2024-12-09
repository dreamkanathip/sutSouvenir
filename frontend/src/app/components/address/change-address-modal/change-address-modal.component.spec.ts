import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAddressModalComponent } from './change-address-modal.component';

describe('ChangeAddressModalComponent', () => {
  let component: ChangeAddressModalComponent;
  let fixture: ComponentFixture<ChangeAddressModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeAddressModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeAddressModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
