import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductManagementService } from './../../services/product-management/product-management.service';
import { CategoryService } from './../../services/category/category.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-management',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  form!: FormGroup;
  categories: any[] = []; // ตัวแปรเก็บข้อมูลหมวดหมู่

  constructor(
    private fb: FormBuilder,
    private productManagementService: ProductManagementService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // สร้างฟอร์ม
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0.01, [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]], // ฟอร์มสำหรับ category
    });

    // ดึงข้อมูลหมวดหมู่จากฐานข้อมูล
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data; // เก็บข้อมูลหมวดหมู่ที่ดึงมา
      },
      (error) => {
        console.error('ไม่สามารถดึงข้อมูลหมวดหมู่ได้:', error);
        Swal.fire({
          icon: 'error',
          title: 'ข้อผิดพลาด',
          text: 'ไม่สามารถดึงข้อมูลหมวดหมู่ได้!',
        });
      }
    );
  }

  // ฟังก์ชันย้อนกลับ
  goToManagements(): void {
    this.router.navigate(['/admin/management']); // นำทางไปยังหน้าที่ต้องการ
  }

  // ฟังก์ชันสำหรับการ submit
  submit(): void {
    if (this.form.invalid) {
      console.log('ฟอร์มไม่ถูกต้อง');
      return;
    }

    const formData = {
      title: this.form.value.title,
      description: this.form.value.description,
      price: this.form.value.price,
      quantity: this.form.value.quantity,
      categoryId: this.form.value.category, // ใช้ categoryId แทน category name
    };

    Swal.fire({
      title: 'คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่?',
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      icon: 'warning',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productManagementService.addProduct(formData).subscribe(
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
                category: null, // ตั้งค่าเป็น null แทนที่จะเป็น ''
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
