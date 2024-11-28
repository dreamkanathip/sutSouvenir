import { Product } from './../../interfaces/products/products.model';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  getSomeProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/product/${id}`, {
      withCredentials: true,
    });
  }

  // ลบสินค้าตาม ID
  deleteProductById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/product/${id}`, {
      withCredentials: true,
    });
  }

  // เพิ่มสินค้าใหม่
  addProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/product`, product);
  }

  // อัปเดตข้อมูลสินค้า
  updateProduct(product: any, id: string): Observable<any> {
    console.log('service', product);
    return this.http.put(`${this.apiUrl}/product/${id}`, product, {
      withCredentials: true,
    });
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
