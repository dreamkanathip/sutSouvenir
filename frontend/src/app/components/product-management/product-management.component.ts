import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductManagementService } from './../../services/product-management/product-management.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productManagementService: ProductManagementService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0.01, [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required]],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      console.log('ฟอร์มไม่ถูกต้อง');
      return;
    }

    Swal.fire({
      title: 'คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่?',
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      icon: 'warning',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productManagementService.addProduct(this.form.value).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: 'สินค้าถูกบันทึกแล้ว!',
            }).then(() => {
              // รีเซ็ตฟอร์มหลังจากบันทึกสำเร็จ
              this.form.reset({
                title: '',
                quantity: 1,
                price: 0.01,
                description: '',
              });
            });
          },
          (error) => {
            console.error('เกิดข้อผิดพลาดในการบันทึกสินค้า:', error);
            Swal.fire({
              icon: 'error',
              title: 'ข้อผิดพลาด',
              text: 'ไม่สามารถบันทึกสินค้าได้!',
            });
          }
        );
      }
    });
  }
}
