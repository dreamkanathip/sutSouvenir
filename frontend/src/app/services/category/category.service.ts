import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs'; // ใช้สำหรับจับข้อผิดพลาด
import { Category } from '../../interfaces/category/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  // แก้ไข URL สำหรับการเพิ่มหมวดหมู่
  private apiUrl = 'http://localhost:5000/api'; // URL พื้นฐาน

  constructor(private http: HttpClient) {}

  // ฟังก์ชันดึงข้อมูลหมวดหมู่
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`).pipe(
      catchError((error) => {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่:', error);
        return throwError(error); // ส่งข้อผิดพลาดให้กับ subscriber
      })
    );
  }

  // ฟังก์ชันเพิ่มหมวดหมู่
  addCategory(categoryData: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/add/categories`, categoryData)
      .pipe(
        catchError((error) => {
          console.error('เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่สินค้า:', error);
          return throwError(error); // ส่งข้อผิดพลาดให้กับ subscriber
        })
      );
  }

  // ฟังก์ชันลบหมวดหมู่
  deleteCategoryById(id: number) {
    console.log(`Sending DELETE request for categories ID: ${id}`);
    return this.http
      .delete(`${this.apiUrl}/categories/${id}`, { withCredentials: true })
      .pipe(
        catchError((error) => {
          console.error(
            `เกิดข้อผิดพลาดในการหมวดหมู่สินค้าลบสินค้า ID: ${id}`,
            error
          );
          return throwError(
            () =>
              new Error('ไม่สามารถลบหมวดหมู่สินค้าได้ กรุณาลองใหม่อีกครั้ง.')
          );
        })
      );
  }

  // ฟังก์ชันในการอัปเดตข้อมูลหมวดหมู่
  updateCategory(
    categoryId: number,
    category: { name: string }
  ): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/edit/category/${categoryId}`, category)
      .pipe(
        catchError((error) => {
          console.error(
            `เกิดข้อผิดพลาดในการอัปเดตสินค้า ID: ${categoryId}`,
            error
          );
          return throwError(
            () => new Error('ไม่สามารถอัปเดตสินค้าได้ กรุณาลองใหม่อีกครั้ง.')
          );
        })
      );
  }
}
