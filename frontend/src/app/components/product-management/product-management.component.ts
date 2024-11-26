import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductManagementService } from './../../services/product-management/product-management.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private productManagementService: ProductManagementService
  ) {
    this.form = this.formBuilder.group({
      // ฟอร์มสินค้า
      title: ['', [Validators.required, Validators.minLength(2)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    // เริ่มต้นข้อมูลอื่นๆ ที่จำเป็น
  }

  // ฟังก์ชั่นการบันทึกข้อมูลสินค้า
  submit(): void {
    if (this.form.invalid) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const product = this.form.getRawValue(); // ดึงข้อมูลจากฟอร์ม
    console.log(product); // ตรวจสอบข้อมูลที่ดึงจากฟอร์ม

    // บันทึกข้อมูลสินค้า
    this.http
      .post('http://localhost:5000/api/product', product, {
        withCredentials: true,
      })
      .subscribe(
        () => {
          Swal.fire('บันทึกสินค้าสำเร็จ');
          this.router.navigate(['/home']);
        },
        (err) => {
          Swal.fire('เกิดข้อผิดพลาด ไม่สามารถบันทึกสินค้าได้ในขณะนี้');
        }
      );
  }

  cancel() {
    this.form.reset();
    this.router.navigate(['/home']);
  }
}
