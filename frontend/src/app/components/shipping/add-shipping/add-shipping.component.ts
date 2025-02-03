import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ShippingService } from '../../../services/shipping/shipping.service';

@Component({
  selector: 'app-add-shipping',
  templateUrl: './add-shipping.component.html',
  styleUrl: './add-shipping.component.css',
})
export class AddShippingComponent {
  @Output() reloadData = new EventEmitter<void>();

  shippingData = new FormGroup({
    company: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]), // ต้องไม่ว่างและอย่างน้อย 2 ตัวอักษร
    fees: new FormControl('', [Validators.required, Validators.min(0)]), // ต้องไม่ว่างและมากกว่าหรือเท่ากับ 0
  });

  constructor(private shippingService: ShippingService) {}

  addShipping() {
    const customSwal = Swal.mixin({
      customClass: {
        popup: 'title-swal',
        confirmButton: 'text-swal',
        cancelButton: 'text-swal',
      },
    });
    customSwal
      .fire({
        title: 'คุณต้องการบันทึกหรือไม่?',
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        cancelButtonText: 'ยกเลิก',
        icon: 'warning',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.shippingService
            .createShipping(this.shippingData.value)
            .subscribe(
              () => {
                customSwal
                  .fire({
                    icon: 'success',
                    title: 'สำเร็จ',
                    text: 'ข้อมูลถูกบันทึกแล้ว!',
                    confirmButtonText: 'ตกลง', // เปลี่ยนจาก OK เป็น ตกลง
                  })
                  .then(() => {
                    this.reloadData.emit();
                    window.location.reload(); // รีเฟรชหน้าหลังจากบันทึกข้อมูลสำเร็จ
                  });
              },
              (error) => {
                console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
                customSwal.fire({
                  icon: 'error',
                  title: 'ข้อผิดพลาด',
                  text: 'ไม่สามารถบันทึกข้อมูลได้!',
                  confirmButtonText: 'ตกลง', // เปลี่ยนจาก OK เป็น ตกลง
                });
              }
            );
        }
      });
  }
}
