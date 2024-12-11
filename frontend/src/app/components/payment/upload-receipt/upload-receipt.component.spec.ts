import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadReceiptComponent } from './upload-receipt.component';

describe('UploadReceiptComponent', () => {
  let component: UploadReceiptComponent;
  let fixture: ComponentFixture<UploadReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadReceiptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
