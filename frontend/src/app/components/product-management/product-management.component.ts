import { Component, OnInit } from '@angular/core';
import { ProductManagementService } from './../../services/product-management/product-management.service';
import { Product } from './../../interfaces/products/products.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Category } from './../../interfaces/category/category.model'; // Import Category model

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = []; // เก็บข้อมูลหมวดหมู่
  currentPage: number = 1;
  itemsPerPage: number = 5;
  pagedProducts: any[] = [];
  editMode: boolean = false;
  selectedProduct: Product = {} as Product; // เก็บข้อมูลสินค้าที่เลือกแก้ไข

  constructor(
    private productManagementService: ProductManagementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllProducts(); // เรียกฟังก์ชันเพื่อดึงข้อมูลสินค้าทั้งหมด
    this.loadPage(this.currentPage);
  }

  // ฟังก์ชันที่เรียกใช้เมื่อคลิกปุ่ม "แก้ไข"
  editProduct(productId: number) {
    this.selectedProduct = this.products.find(
      (product) => product.id === productId
    ) as Product; // คัดเลือกสินค้าที่จะถูกแก้ไข
    this.editMode = true; // เปิดการแสดงผล edit-card
    document.body.classList.add('modal-open'); // เพิ่ม class เพื่อให้ dark overlay
  }

  // ฟังก์ชันสำหรับปิด modal หรือ cancel การแก้ไข
  closeEditCard() {
    this.editMode = false; // ปิด modal
    document.body.classList.remove('modal-open'); // เอา class ออก
  }

  getAllProducts(): void {
    this.productManagementService.getAllProduct().subscribe(
      (data) => {
        console.log('ข้อมูลสินค้าทั้งหมด:', data); // ตรวจสอบว่า category มีข้อมูล
        this.products = data;
      },
      (error) => {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:', error);
      }
    );
  }

  // ฟังก์ชันบันทึกการแก้ไขข้อมูลสินค้า
  saveEditProduct(): void {
    if (this.selectedProduct && this.selectedProduct.id) {
      const { id, title, quantity, price, description, category } =
        this.selectedProduct;

      // ตรวจสอบให้แน่ใจว่าไม่มีข้อมูลที่สำคัญขาดหาย
      if (!title || !quantity || !price || !description || !category) {
        Swal.fire({
          title: 'ข้อมูลไม่ครบถ้วน',
          text: 'กรุณากรอกข้อมูลให้ครบถ้วนก่อนทำการบันทึก',
          icon: 'warning',
        });
        return;
      }

      // เรียกใช้ฟังก์ชัน updateProduct โดยส่ง productId และข้อมูลสินค้าที่ต้องการอัปเดต
      this.productManagementService
        .updateProduct(id, { title, quantity, price, description, category })
        .pipe(
          catchError((error) => {
            console.error('เกิดข้อผิดพลาดในการอัปเดตสินค้า:', error);
            Swal.fire({
              title: 'เกิดข้อผิดพลาด!',
              text: 'ไม่สามารถอัปเดตข้อมูลสินค้าได้ กรุณาลองใหม่',
              icon: 'error',
            });
            return of(null);
          })
        )
        .subscribe((response) => {
          if (response) {
            Swal.fire({
              title: 'สำเร็จ!',
              text: 'ข้อมูลสินค้าได้รับการอัปเดต',
              icon: 'success',
            });
            this.getAllProducts(); // รีเฟรชข้อมูลสินค้า
            this.closeEditCard(); // ปิดการ์ดฟอร์มแก้ไข
          }
        });
    } else {
      Swal.fire({
        title: 'ข้อมูลไม่ถูกต้อง',
        text: 'ไม่พบสินค้าที่จะอัปเดต กรุณาลองใหม่',
        icon: 'error',
      });
    }
  }

  // ฟังก์ชันลบสินค้าตาม ID
  deleteProductById(event: MouseEvent, productId: number): void {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการลบสินค้านี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this.products = this.products.filter(
          (product) => product.id !== productId
        );
        this.loadPage(this.currentPage);

        this.productManagementService
          .deleteProductById(productId)
          .pipe(
            catchError((error) => {
              console.error('เกิดข้อผิดพลาดในการลบสินค้า:', error);
              Swal.fire({
                title: 'เกิดข้อผิดพลาด!',
                text: 'ไม่สามารถลบสินค้าได้ กรุณาลองใหม่อีกครั้ง',
                icon: 'error',
              });
              return of(null);
            })
          )
          .subscribe((res: any) => {
            if (res) {
              this.getAllProducts();
              Swal.fire({
                title: 'สำเร็จ!',
                text: 'ลบสินค้าสำเร็จ',
                icon: 'success',
              });
            }
          });
      }
    });

    event.stopPropagation(); // ป้องกัน Event Bubbling
  }

  loadPage(page: number) {
    this.currentPage = page;
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedProducts = this.products.slice(start, end);

    const emptyRows = this.itemsPerPage - this.pagedProducts.length;
    for (let i = 0; i < emptyRows; i++) {
      this.pagedProducts.push({
        title: '',
        quantity: '',
        price: '',
        description: '',
        category: {} as Category, // เพิ่ม category เป็นอ็อบเจ็กต์ว่าง
      });
    }
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.products.length) {
      this.loadPage(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }

  navigateToAddProduct(): void {
    this.router.navigate(['/admin/add/product']);
  }
}
