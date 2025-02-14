import { Router } from '@angular/router';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category/category.service';
import Swal from 'sweetalert2';
import { Category } from '../../interfaces/category/category.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  categories: any[] = [];
  filteredCategories: Category[] = [];
  pagedCategories: any[] = [];
  isLoading = false;
  selectedCategoryFilter: string = 'ALL';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  showCategoryForm = false;
  newCategory: any = { name: '' };
  selectedCategory: Category = {} as Category;
  editMode: boolean = false; // เพิ่มตัวแปร editMode

  edit: Category = {} as Category;

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.updatePagedCategories();
  }

  ngOnInit(): void {
    this.loadCategories(); // Load categories on component initialization
  }
  get paginatedCategories() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = this.currentPage * this.itemsPerPage;
    return this.categories.slice(start, end);
  }
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1; // Page index is 0-based, so we add 1 for 1-based indexing
    this.itemsPerPage = event.pageSize;
    this.updatePagedCategories(); // Update paged categories after page change
  }

  updatePagedCategories(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage; // Correct start index calculation
    const end = this.currentPage * this.itemsPerPage; // Correct end index calculation
    this.pagedCategories = this.filteredCategories.slice(start, end); // Update pagedCategories with the correct slice

    console.log('updatePagedCategories()');
  }

  loadCategories(): void {
    const customSwal = Swal.mixin({
      customClass: {
        popup: 'title-swal',
        confirmButton: 'text-swal',
      },
    });
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.filterCategories();
        this.updatePagedCategories();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        customSwal.fire('Error', 'Could not fetch categories', 'error');
        this.isLoading = false;
      },
    });
  }

  filterCategories(): void {
    if (this.selectedCategoryFilter === 'ALL') {
      this.filteredCategories = this.categories;
    } else {
      this.filteredCategories = this.categories.filter(
        (category) =>
          category.name.toUpperCase() === this.selectedCategoryFilter
      );
    }
    this.updatePagedCategories();
  }

  openAddCategory(): void {
    // Navigate to the category addition page
    this.router.navigate(['/admin/add/category']);
  }

  addCategory(): void {
    const customSwal = Swal.mixin({
      customClass: {
        popup: 'title-swal',
        confirmButton: 'text-swal',
      },
    });
    if (this.newCategory.name.trim()) {
      this.categoryService.addCategory(this.newCategory).subscribe({
        next: (response) => {
          this.categories.push(response); // เพิ่มหมวดหมู่ใหม่
          this.filterCategories();
          this.updatePagedCategories();
          this.newCategory.name = ''; // รีเซ็ตฟอร์ม
          this.showCategoryForm = false; // ปิดฟอร์ม
          customSwal.fire('Success', 'Category added successfully', 'success');
        },
        error: (err) => {
          console.error('Error adding category:', err);
          customSwal.fire('Error', 'Could not add category', 'error');
        },
      });
    } else {
      customSwal.fire('Please enter a category name');
    }
  }

  editCategory(category: Category): void {
    this.edit = category;
  }

  // ฟังก์ชันแก้ไขหมวดหมู่
  openEditCategory(category: any): void {
    this.selectedCategory = { ...category }; // คัดลอกข้อมูลหมวดหมู่ที่ต้องการแก้ไข
    this.editMode = true; // เปิดโหมดการแก้ไข
  }

  saveEditCategory(): void {
    const customSwal = Swal.mixin({
      customClass: {
        popup: 'title-swal',
        confirmButton: 'text-swal',
      },
    });
    if (this.selectedCategory && this.selectedCategory.name.trim()) {
      // เรียกใช้งาน service เพื่ออัปเดตหมวดหมู่
      this.categoryService
        .updateCategory(this.selectedCategory.id, {
          name: this.selectedCategory.name,
        })
        .subscribe({
          next: (response) => {
            // อัปเดตหมวดหมู่ในรายการ
            const index = this.categories.findIndex(
              (category) => category.id === this.selectedCategory.id
            );
            if (index !== -1) {
              this.categories[index] = response; // แทนที่ข้อมูลใน array ด้วยข้อมูลใหม่
              this.filterCategories(); // อัปเดตการกรอง
              this.updatePagedCategories(); // อัปเดต pagination
            }

            // รีเซ็ตสถานะการแก้ไข
            this.selectedCategory;
            this.editMode = false;

            // แจ้งเตือนสำเร็จ
            customSwal.fire(
              'สำเร็จ',
              'หมวดหมู่ถูกอัปเดตเรียบร้อยแล้ว',
              'success'
            );
          },
          error: (err) => {
            console.error('เกิดข้อผิดพลาดในการอัปเดตหมวดหมู่:', err);
            customSwal.fire(
              'เกิดข้อผิดพลาด',
              'ไม่สามารถอัปเดตหมวดหมู่ได้',
              'error'
            );
          },
        });
    } else {
      // แจ้งเตือนหากชื่อหมวดหมู่ว่างเปล่า
      customSwal.fire('กรุณากรอกชื่อหมวดหมู่');
    }
  }

  // ฟังก์ชันลบหมวดหมู่
  deleteCategoryById(event: MouseEvent, categoryId: number): void {
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
        text: 'คุณต้องการลบหมวดหมู่นี้หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ลบเลย!',
        cancelButtonText: 'ยกเลิก',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.categoryService.deleteCategoryById(categoryId).subscribe({
            next: () => {
              // ลบหมวดหมู่ออกจาก categories
              this.categories = this.categories.filter(
                (category) => category.id !== categoryId
              );

              // เรียกฟังก์ชันเพื่ออัปเดตข้อมูลที่แสดงบนหน้า
              this.filterCategories();
              this.updatePagedCategories();

              customSwal.fire({
                title: 'สำเร็จ!',
                text: 'ลบหมวดหมู่เรียบร้อยแล้ว',
                icon: 'success',
              });
            },
            error: (error) => {
              console.error('เกิดข้อผิดพลาดในการลบหมวดหมู่:', error);
              customSwal.fire({
                title: 'เกิดข้อผิดพลาด!',
                text: 'ไม่สามารถลบหมวดหมู่ได้ กรุณาลองอีกครั้ง',
                icon: 'error',
              });
            },
          });
        }
      });

    event.stopPropagation();
  }

  // ฟังก์ชัน closeEditCard
  closeEditCard(): void {
    this.selectedCategory; // รีเซ็ตข้อมูลหมวดหมู่ที่แก้ไข
    this.editMode = false; // ปิดโหมดการแก้ไข
  }
}
