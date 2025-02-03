import { Component, OnInit } from '@angular/core';
import { ProductManagementService } from './../../services/product-management/product-management.service';
import { Product, Images } from './../../interfaces/products/products.model';
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
  itemsPerPage: number = 3; // จำนวนแถวต่อหน้า
  pagedProducts: Product[] = []; // ข้อมูลสินค้าสำหรับหน้าที่กำลังแสดง
  editMode: boolean = false; // สถานะการแก้ไขสินค้า
  selectedProduct: Product = {} as Product; // สินค้าที่ถูกเลือกเพื่อแก้ไข
  productImages: { imageId: number; productId: number; url: string }[] = [];
  selectedImage: File | null = null; // สำหรับเก็บไฟล์รูปภาพที่เลือก
  previewImage: string | ArrayBuffer | null = null; // สำหรับเก็บรูปภาพที่เลือก

  constructor(
    private productManagementService: ProductManagementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts(); // เรียกข้อมูลสินค้าเมื่อโหลดหน้าจอ
  }

  loadProducts(): void {
    this.productManagementService.getAllProduct().subscribe(
      (data) => {
        this.products = data;
        data.forEach((product) => {
          product.images.forEach((image) => {
            this.productImages.push({
              imageId: image.id,
              productId: product.id,
              url: `${image.url}${image.asset_id}`,
            });
          });
        });
        this.loadPage(this.currentPage); // แสดงหน้าปัจจุบัน
      },
      (error) => {
        console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า:', error);
      }
    );
  }

  getImageUrl(id: number): string {
    const image = this.productImages.find((image) => image.productId === id);
    return image ? image.url : 'none'; // หากไม่พบรูปภาพให้แสดงรูปภาพ default
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  addProduct(newProduct: Product): void {
    const customSwal = Swal.mixin({
      customClass: {
        popup: 'title-swal',
        confirmButton: 'text-swal',
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
          if (this.selectedImage) {
            this.uploadProductImage(response.id);
          }

          customSwal.fire({
            title: 'สำเร็จ!',
            text: 'เพิ่มสินค้าเรียบร้อยแล้ว',
            icon: 'success',
          });

          this.products.push(response);
          this.loadPage(this.currentPage);

          if (this.pagedProducts.length === this.itemsPerPage) {
            this.loadPage(Math.ceil(this.products.length / this.itemsPerPage));
          }
        }
      });
  }

  uploadProductImage(productId: number): void {
    if (this.selectedImage) {
      const formData = new FormData();
      formData.append('image', this.selectedImage);
      formData.append('productId', productId.toString());

      this.productManagementService.uploadProductImage(formData).subscribe(
        (response) => {
          console.log('อัปโหลดรูปภาพสำเร็จ:', response);
          // อัปเดตรูปภาพใหม่ใน productImages
          const imageUrl = `${response.url}${response.asset_id}`; // หรือ URL ของรูปภาพที่ได้จากการอัปโหลด
          const existingImageIndex = this.productImages.findIndex(
            (image) => image.productId === productId
          );

          if (existingImageIndex !== -1) {
            // แทนที่รูปภาพที่มีอยู่
            this.productImages[existingImageIndex].url = imageUrl;
          } else {
            // เพิ่มรูปภาพใหม่
            this.productImages.push({
              imageId: response.id,
              productId,
              url: imageUrl,
            });
          }

          this.loadProducts(); // รีโหลดข้อมูลสินค้า
        },
        (error) => {
          console.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ:', error);
        }
      );
    }
  }

  editProduct(productId: number): void {
    this.selectedProduct = this.products.find(
      (product) => product.id === productId
    ) as Product;
    this.editMode = true;
    document.body.classList.add('modal-open');
  }

  closeEditCard(): void {
    this.editMode = false;
    document.body.classList.remove('modal-open');
  }

  saveEditProduct(): void {
    const customSwal = Swal.mixin({
      customClass: {
        popup: 'title-swal',
        confirmButton: 'text-swal',
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
            if (this.selectedImage) {
              this.uploadProductImage(id);
            }
            customSwal.fire({
              title: 'สำเร็จ!',
              text: 'แก้ไขสินค้าเรียบร้อยแล้ว',
              icon: 'success',
            });
            this.loadProducts();
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

  deleteProductById(event: MouseEvent, productId: number): void {
    const customSwal = Swal.mixin({
      customClass: {
        popup: 'title-swal',
        confirmButton: 'text-swal',
        cancelButton: 'text-swal',
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

  loadPage(page: number): void {
    this.currentPage = page;
    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const slicedProducts = this.products.slice(start, end);
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

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.products.length) {
      this.loadPage(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }

  navigateToAddProduct(): void {
    this.router.navigate(['/admin/add/product']);
  }

  // ฟังก์ชันสำหรับจัดการเมื่อผู้ใช้เลือกไฟล์
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
      this.selectedImage = file;
    }
  }

  removeImage(): void {
    if (this.selectedImage) {
      this.selectedImage = null;
      this.previewImage = null; // เคลียร์การแสดงภาพตัวอย่าง
      console.log('ลบรูปภาพเรียบร้อยแล้ว');
    } else {
      Swal.fire({
        title: 'ไม่มีรูปภาพ',
        text: 'กรุณาเลือกภาพก่อนที่จะลบ',
        icon: 'warning',
      });
    }
  }
}
