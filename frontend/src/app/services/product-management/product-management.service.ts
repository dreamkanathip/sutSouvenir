import { Product } from './../../interfaces/products/products.model';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductManagementService implements OnInit {
  apiUrl = 'http://localhost:5000/api'; // API Base URL

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  // ดึงสินค้าทั้งหมด
  getAllProduct(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`, {
      withCredentials: true,
    });
  }

  // ดึงข้อมูลสินค้าตาม ID
  getSomeProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/product/${id}`, {
      withCredentials: true,
    });
  }

  // ฟังก์ชันในการอัปเดตข้อมูลสินค้า
  updateProduct(productId: number, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/product/${productId}`, product).pipe(
      catchError((error) => {
        console.error(
          `เกิดข้อผิดพลาดในการอัปเดตสินค้า ID: ${productId}`,
          error
        );
        return throwError(
          () => new Error('ไม่สามารถอัปเดตสินค้าได้ กรุณาลองใหม่อีกครั้ง.')
        );
      })
    );
  }

  // ลบสินค้าตาม ID
  deleteProductById(id: number) {
    console.log(`Sending DELETE request for product ID: ${id}`);
    return this.http
      .delete(`${this.apiUrl}/product/${id}`, { withCredentials: true })
      .pipe(
        catchError((error) => {
          console.error(`เกิดข้อผิดพลาดในการลบสินค้า ID: ${id}`, error);
          return throwError(
            () => new Error('ไม่สามารถลบสินค้าได้ กรุณาลองใหม่อีกครั้ง.')
          );
        })
      );
  }

  // เพิ่มสินค้าใหม่
  addProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/product`, product);
  }

  // ฟังก์ชันค้นหาสินค้าตามฟิลเตอร์ (ถ้ามี)
  searchFilters(filters: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/search/filters`, filters, {
      withCredentials: true,
    });
  }

  // ฟังก์ชันค้นหาสินค้าตามประเภทหรือค่าย่อย
  listby(filterData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/productby`, filterData, {
      withCredentials: true,
    });
  }
}
