import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from './../../services/category/category.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-management',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css'],
})
export class AddCategoryComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // สร้างฟอร์ม
    this.form = this.fb.group({
      name: ['', [Validators.required]], // ฟอร์มสำหรับชื่อหมวดหมู่
    });
  }

  // ฟังก์ชันย้อนกลับ
  submit(): void {
    if (this.form.invalid) {
      console.log('ฟอร์มไม่ถูกต้อง');
      return;
    }

    const formData = {
      name: this.form.value.name, // เก็บข้อมูลชื่อหมวดหมู่
    };
    const customSwal = Swal.mixin({
      customClass: {
        popup: 'title-swal',
        confirmButton: 'text-swal',
        cancelButton: 'text-swal',
      },
    });

    customSwal
      .fire({
        title: 'คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่?',
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        icon: 'warning',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.categoryService.addCategory(formData).subscribe(
            () => {
              customSwal
                .fire({
                  icon: 'success',
                  title: 'สำเร็จ',
                  text: 'หมวดหมู่ถูกบันทึกแล้ว!',
                })
                .then(() => {
                  // รีเซ็ตฟอร์มหลังจากบันทึกสำเร็จ
                  this.form.reset({
                    name: '', // ตั้งค่าเป็นค่าว่างหลังจากบันทึก
                  });

                  // รีเฟรชหน้า
                  window.location.reload(); // เพิ่มการรีเฟรชหน้า
                });
            },
            (error) => {
              console.error('เกิดข้อผิดพลาดในการบันทึกหมวดหมู่:', error);
              customSwal.fire({
                icon: 'error',
                title: 'ข้อผิดพลาด',
                text: 'ไม่สามารถบันทึกหมวดหมู่ได้!',
              });
            }
          );
        }
      });
  }

  // ฟังก์ชันสำหรับการย้อนกลับไปหน้าหมวดหมู่
  goToCategories(): void {
    // นำทางไปยังหน้าหมวดหมู่
    this.router.navigate(['/admin/show/category']);
  }
}
