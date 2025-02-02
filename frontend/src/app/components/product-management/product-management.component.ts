import { Component, OnInit } from '@angular/core';
import { ProductManagementService } from './../../services/product-management/product-management.service';
import { Product } from './../../interfaces/products/products.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Category } from './../../interfaces/category/category.model'; // ใช้สำหรับหมวดหมู่สินค้า

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = []; // รายการสินค้าทั้งหมด
  categories: Category[] = []; // รายการหมวดหมู่สินค้า
  currentPage: number = 1; // หน้าปัจจุบัน
  itemsPerPage: number = 5; // จำนวนแถวต่อหน้า
  pagedProducts: Product[] = []; // ข้อมูลสินค้าสำหรับหน้าที่กำลังแสดง
  editMode: boolean = false; // สถานะการแก้ไขสินค้า
  selectedProduct: Product = {} as Product; // สินค้าที่ถูกเลือกเพื่อแก้ไข

  constructor(
    private productManagementService: ProductManagementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts(); // เรียกข้อมูลสินค้าเมื่อโหลดหน้าจอ
  }

  // โหลดข้อมูลสินค้าทั้งหมด
  loadProducts(): void {
    this.productManagementService.getAllProduct().subscribe(
      (data) => {
        this.products = data;
        this.loadPage(this.currentPage); // แสดงหน้าปัจจุบัน
      },
      (error) => {
        console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า:', error);
      }
    );
  }

  // เพิ่มสินค้าใหม่
  addProduct(newProduct: Product): void {
    const customSwal = Swal.mixin({
      customClass: {
        popup: 'title-swal',
      },
    });
    this.productManagementService
      .addProduct(newProduct)
      .pipe(
        catchError((error) => {
          console.error('เกิดข้อผิดพลาดในการเพิ่มสินค้า:', error);
          customSwal.fire({
            title: 'เกิดข้อผิดพลาด!',
            text: 'ไม่สามารถเพิ่มสินค้าได้ กรุณาลองอีกครั้ง',
            icon: 'error',
          });
          return of(null);
        })
      )
      .subscribe((response: Product | null) => {
        if (response) {
          customSwal.fire({
            title: 'สำเร็จ!',
            text: 'เพิ่มสินค้าเรียบร้อยแล้ว',
            icon: 'success',
          });

          this.products.push(response);
          this.loadPage(this.currentPage);

          // หากหน้าปัจจุบันเต็ม ให้เปลี่ยนไปหน้าถัดไป
          if (this.pagedProducts.length === this.itemsPerPage) {
            this.loadPage(Math.ceil(this.products.length / this.itemsPerPage));
          }
        }
      });
  }

  // แก้ไขสินค้า
  editProduct(productId: number): void {
    this.selectedProduct = this.products.find(
      (product) => product.id === productId
    ) as Product;
    this.editMode = true;
    document.body.classList.add('modal-open');
  }

  // ปิดหน้าต่างแก้ไข
  closeEditCard(): void {
    this.editMode = false;
    document.body.classList.remove('modal-open');
  }

  // บันทึกสินค้าเมื่อแก้ไขเสร็จ
  saveEditProduct(): void {
    const customSwal = Swal.mixin({
      customClass: {
        popup: 'title-swal',
      },
    });
    if (this.selectedProduct && this.selectedProduct.id) {
      const { id, title, quantity, price, description, category } =
        this.selectedProduct;

      if (!title || !quantity || !price || !description || !category) {
        customSwal.fire({
          title: 'ข้อมูลไม่ครบถ้วน',
          text: 'กรุณากรอกข้อมูลให้ครบก่อนบันทึก',
          icon: 'warning',
        });
        return;
      }

      this.productManagementService
        .updateProduct(id, { title, quantity, price, description, category })
        .pipe(
          catchError((error) => {
            console.error('เกิดข้อผิดพลาดในการแก้ไขสินค้า:', error);
            customSwal.fire({
              title: 'เกิดข้อผิดพลาด!',
              text: 'ไม่สามารถแก้ไขสินค้าได้ กรุณาลองอีกครั้ง',
              icon: 'error',
            });
            return of(null);
          })
        )
        .subscribe((response) => {
          if (response) {
            customSwal.fire({
              title: 'สำเร็จ!',
              text: 'แก้ไขสินค้าเรียบร้อยแล้ว',
              icon: 'success',
            });
            this.loadProducts(); // โหลดข้อมูลสินค้าใหม่
            this.closeEditCard();
          }
        });
    } else {
      customSwal.fire({
        title: 'ข้อมูลไม่ถูกต้อง',
        text: 'ไม่พบสินค้าที่ต้องการแก้ไข กรุณาลองอีกครั้ง',
        icon: 'error',
      });
    }
  }

  // ลบสินค้าตาม ID
  deleteProductById(event: MouseEvent, productId: number): void {
    const customSwal = Swal.mixin({
      customClass: {
        popup: 'title-swal',
      },
    });
    customSwal
      .fire({
        title: 'ยืนยันการลบ?',
        text: 'คุณต้องการลบสินค้านี้หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ลบเลย!',
        cancelButtonText: 'ยกเลิก',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.productManagementService
            .deleteProductById(productId)
            .pipe(
              catchError((error) => {
                console.error('เกิดข้อผิดพลาดในการลบสินค้า:', error);
                customSwal.fire({
                  title: 'เกิดข้อผิดพลาด!',
                  text: 'ไม่สามารถลบสินค้าได้ กรุณาลองอีกครั้ง',
                  icon: 'error',
                });
                return of(null);
              })
            )
            .subscribe((res) => {
              if (res) {
                this.products = this.products.filter(
                  (product) => product.id !== productId
                );
                customSwal.fire({
                  title: 'สำเร็จ!',
                  text: 'ลบสินค้าเรียบร้อยแล้ว',
                  icon: 'success',
                });
                this.loadPage(this.currentPage);
              }
            });
        }
      });

    event.stopPropagation();
  }

  // โหลดหน้าสินค้าในหน้าที่กำหนด
  loadPage(page: number): void {
    this.currentPage = page;
    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    // ตัดข้อมูลตามหน้าปัจจุบัน
    const slicedProducts = this.products.slice(start, end);

    // หากข้อมูลไม่ครบ 5 แถว ให้เพิ่ม placeholder
    this.pagedProducts = [
      ...slicedProducts,
      ...Array(this.itemsPerPage - slicedProducts.length).fill({
        id: 0,
        title: '',
        quantity: '',
        price: '',
        description: '',
        category: '',
      }),
    ];
  }

  // ไปหน้าถัดไป
  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.products.length) {
      this.loadPage(this.currentPage + 1);
    }
  }

  // ไปหน้าก่อนหน้า
  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }

  // ไปหน้าเพิ่มสินค้า
  navigateToAddProduct(): void {
    this.router.navigate(['/admin/add/product']);
  }
}
