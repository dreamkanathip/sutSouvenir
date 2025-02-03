import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductManagementService } from './../../services/product-management/product-management.service';
import { Product, Images } from './../../interfaces/products/products.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { catchError, tap } from 'rxjs/operators';
import { firstValueFrom, from, of } from 'rxjs';
import { Category } from './../../interfaces/category/category.model'; // ใช้สำหรับหมวดหมู่สินค้า
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category/category.service';
import { format } from 'path';

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
  selectedProduct!: Product;
  productImages: { imageId: number; productId: number; url: string }[] = [];
  selectedImage: File | null = null; // สำหรับเก็บไฟล์รูปภาพที่เลือก
  form!: FormGroup;
  selectedCategory: number = 0

  selectedProductImages: Images[] = [];
  imgToUpload: File[] = []
  imgToDelete: Images[] = [];
  imagePreview: string[] | ArrayBuffer[] = [];
  constructor(
    private productManagementService: ProductManagementService,
    private router: Router,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) { 
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      quantity: [[Validators.required, Validators.min(1) ,Validators.pattern(/^[0-9]*$/)]],
      price: [[Validators.required, Validators.min(1), Validators.pattern(/^[0-9]*$/)]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
    });

    this.loadProducts(); // เรียกข้อมูลสินค้าเมื่อโหลดหน้าจอ
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

  get title() {
    return this.form.get('title')
  }
  get quantity() {
    return this.form.get('quantity')
  }
  get price() {
    return this.form.get('price')
  }
  get description() {
    return this.form.get('description')
  }
  get category() {
    return this.form.get('category')
  }
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1; // Page index is 0-based, so we add 1 for 1-based indexing
    this.itemsPerPage = event.pageSize;
    this.updatePagedProducts(); // Update paged categories after page change
  }
  updatePagedProducts(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage; // Correct start index calculation
    const end = this.currentPage * this.itemsPerPage; // Correct end index calculation
    this.pagedProducts = this.products.slice(start, end); // Update pagedCategories with the correct slice

    console.log('updatePagedCategories()');
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
        this.loadPage(this.currentPage);
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
  showImage(image: Images): string {
    if (image) {
      return String(image.url) + String(image.asset_id);
    }
    return ''
  }
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  upProduct(newProduct: Product): void {
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

  editProduct(product: Product): void {
    this.selectedProduct = product
    this.selectedProductImages = []
    if (this.selectedProduct) {
      this.form.patchValue({
        title: this.selectedProduct.title,
        description: this.selectedProduct.description,
        price: this.selectedProduct.price?.toString() || '',
        quantity: this.selectedProduct.quantity?.toString() || '',
        category: this.selectedProduct.category || ''
      });

      product.images.forEach((image) => {
        this.selectedProductImages.push(image);
      });
    }
  }
  onImageAdd(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imgToUpload.push(file);
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
      this.selectedProductImages.splice(index, 1);
      if (res.isConfirmed) {
        customSwal.fire({
          icon: 'success',
          title: 'สำเร็จ',
        })
      }
    })
  }
  removeNewFile(index: number) {
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
      this.imgToUpload.splice(index, 1);
      if (res.isConfirmed) {
        customSwal.fire({
          icon: 'success',
          title: 'สำเร็จ',
        })
      }
    })

  }
  removeFileToBackend(image: Images) {
    this.imgToDelete.push(image)
  }

  closeEditCard(): void {
    this.editMode = false;
    document.body.classList.remove('modal-open');
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

  async saveEditProduct(){
    const customSwal = Swal.mixin({
      customClass: {
        popup: 'title-swal',
        confirmButton: 'text-swal',
      },
    });

    if (this.selectedProduct && this.selectedProduct.id && this.selectedCategory > 0) {
      const formData = {
        title: this.form.value.title,
        description: this.form.value.description,
        price: this.form.value.price,
        quantity: this.form.value.quantity,
        categoryId: this.selectedCategory,
        imgToDelete: this.imgToDelete
      };
      customSwal.fire({
        title: "กำลังดำเนินการ...",
        allowOutsideClick: false,
        didOpen: () => {
          customSwal.showLoading();
        },
      });
      this.productManagementService.updateProduct(this.selectedProduct.id, formData).subscribe({
        next: () => {
          customSwal.close();
          customSwal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: "ทำการบันทึกข้อมูลเรียบร้อยแล้ว",
            showConfirmButton: true,
            confirmButtonText: "ยืนยัน",
          });
          window.location.reload();
        },
        error: (error) => {
          customSwal.close();
          customSwal.fire({
            icon: "error",
            title: "ผิดพลาด",
            text: "บันทึกข้อมูลไม่สำเร็จ",
            showConfirmButton: true,
            confirmButtonText: "ยืนยัน",
          });
          console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล:', error);
        }
      });

      const uploadImage = this.imgToUpload.map((file) => {
        const data = new FormData();
        data.append('image', file, file.name);
        data.append('productId', this.selectedProduct.id.toString());
        return firstValueFrom(this.productManagementService.uploadProductImage(data))
      })
      await Promise.all(uploadImage);

    } else {
      customSwal.fire({
        title: 'ข้อมูลไม่ถูกต้อง',
        text: 'กรุณาลองอีกครั้ง',
        icon: 'error',
      });
    }
  }
}
