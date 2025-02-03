import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductManagementService } from '../../../services/product-management/product-management.service';
import { CategoryService } from '../../../services/category/category.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  form!: FormGroup;
  categories: any[] = []; // ตัวแปรเก็บข้อมูลหมวดหมู่

  selectedFile: File[] = [];

  isDragOver: boolean = false; // ใช้สำหรับแสดงผลเมื่อมีการลากไฟล์
  imagePreview: string[] = [];

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
      quantity: [[Validators.required, Validators.min(1)]],
      price: [[Validators.required, Validators.min(1)]],
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
        const customSwal = Swal.mixin({
          customClass: {
            popup: 'title-swal',
            confirmButton: 'text-swal',
          },
        });
        customSwal.fire({
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

  // ฟังก์ชันจัดการการลากไฟล์
  onDragOver(event: any) {
    event.preventDefault();
    this.isDragOver = true; // แสดงผลเมื่อมีการลากไฟล์
  }

  // ฟังก์ชันจัดการการลากไฟล์ออกจากพื้นที่
  onDragLeave(event: any) {
    this.isDragOver = false; // หยุดแสดงผลเมื่อไฟล์ถูกลากออก
  }

  // ฟังก์ชันจัดการการวางไฟล์
  onDrop(event: any) {
    event.preventDefault(); // ป้องกันไม่ให้ไฟล์เปิดในเบราว์เซอร์
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.selectedFile.push(files[i]);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreview?.push(e.target.result);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  // ฟังก์ชันสำหรับการเพิ่มไฟล์
  onImageAdd(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.push(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview?.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile(index: number) {
      const customSwal = Swal.mixin({
        customClass: {
          popup: 'title-swal',
          confirmButton: 'text-swal',
          cancelButton: 'text-swal',
        },
      });
      customSwal.fire({
        title: 'คุณต้องการลบภาพนี้หรือไม่?',
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        icon: 'warning',
      }).then((res) => {
        this.imagePreview.splice(index, 1);
        this.selectedFile.splice(index, 1)
        if (res.isConfirmed) {
          customSwal.fire({
            icon: 'success',
            title: 'สำเร็จ',
          })
        }
      })
    }

  // ฟังก์ชันสำหรับการ submit ข้อมูล
  async submit() {
    const customSwal = Swal.mixin({
      customClass: {
        popup: 'title-swal',
        confirmButton: 'text-swal',
        cancelButton: 'text-swal',
      },
    });

    if (this.form.invalid) {
      console.log('ฟอร์มไม่ถูกต้อง');
      return;
    }

    if (this.selectedFile.length === 0) {
      customSwal.fire({
        icon: 'warning',
        title: 'ไม่มีไฟล์',
        text: 'กรุณาเลือกไฟล์ภาพสินค้าอย่างน้อย 1 ไฟล์',
      });
      return;
    }

    const formData = {
      title: this.form.value.title,
      description: this.form.value.description,
      price: this.form.value.price,
      quantity: this.form.value.quantity,
      categoryId: this.form.value.category, // ใช้ categoryId แทน category name
    };

    customSwal
      .fire({
        title: 'คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่?',
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        icon: 'warning',
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const newProduct = await firstValueFrom(
            this.productManagementService.addProduct(formData)
          );
          const productId = newProduct.id;

          const uploadImage = this.selectedFile.map((file) => {
            const data = new FormData();
            data.append('image', file, file.name);
            data.append('productId', productId);
            return firstValueFrom(
              this.productManagementService.uploadProductImage(data)
            );
          });

          await Promise.all(uploadImage);

          if (uploadImage) {
            customSwal
              .fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: 'สินค้าถูกบันทึกแล้ว!',
              })
              .then(() => {
                this.selectedFile = [];
                this.imagePreview = [];
                this.form.reset({
                  title: '',
                  quantity: '',
                  price: '',
                  description: '',
                  category: null, // ตั้งค่าเป็น null แทนที่จะเป็น ''
                });
                // รีเฟรชหน้า
                window.location.reload();
              });
          } else {
            console.error('เกิดข้อผิดพลาดในการบันทึกสินค้า');
            customSwal.fire({
              icon: 'error',
              title: 'ข้อผิดพลาด',
              text: 'ไม่สามารถบันทึกสินค้าได้!',
            });
          }
        }
      });
  }
}
