import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ShippingService } from '../../../services/shipping/shipping.service';
import { Shipping } from '../../../interfaces/shipping/shipping.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-shipping',
  templateUrl: './update-shipping.component.html',
  styleUrl: './update-shipping.component.css',
})
export class UpdateShippingComponent implements OnInit {
  form!: FormGroup;

  @Input() shipping: Shipping = {} as Shipping;
  // @Output() reloadData = new EventEmitter<void>();

  constructor(
    private shippingService: ShippingService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      company: [this.shipping.company, [Validators.required]], // ฟอร์มสำหรับชื่อบริษัท
      fees: [this.shipping.fees, [Validators.required]], // ฟอร์มสำหรับค่าบริการ
    });
  }

  updateShipping() {
    const customSwal = Swal.mixin({
      customClass: {
        popup: 'title-swal',
        confirmButton: 'text-swal',
        cancelButton: 'text-swal',
      },
    });

    customSwal
      .fire({
        title: 'คุณต้องการบันทึหรือไม่?', // แจ้งเตือนเมื่อผู้ใช้ต้องการบันทึก
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        cancelButtonText: 'ยกเลิก',
        icon: 'warning',
      })
      .then((result) => {
        if (result.isConfirmed) {
          // ส่งข้อมูลอัพเดตไปที่ server
          this.shippingService
            .updateShipping(this.shipping.id, this.form.value)
            .subscribe(
              () => {
                // แจ้งผู้ใช้ว่าอัพเดตสำเร็จ
                customSwal
                  .fire({
                    icon: 'success',
                    title: 'สำเร็จ',
                    text: 'ข้อมูลถูกบันทึกแล้ว!', // แจ้งเตือนเมื่อบันทึกสำเร็จ
                  })
                  .then(() => {
                    // หลังจากกด "ตกลง" ใน swal ข้อความสำเร็จแล้ว รีโหลดหน้า
                    window.location.reload(); // รีโหลดหน้าใหม่หลังจากบันทึก
                  });
              },
              (error) => {
                console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
                customSwal.fire({
                  icon: 'error',
                  title: 'ข้อผิดพลาด',
                  text: 'ไม่สามารถบันทึกข้อมูลได้!', // แจ้งเตือนเมื่อเกิดข้อผิดพลาด
                });
              }
            );
        }
      });
  }

  goToShipping(): void {
    this.router.navigate(['/superadmin/shipping']);
  }
}
