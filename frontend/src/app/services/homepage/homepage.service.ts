import { Injectable } from '@angular/core';
import { Product } from '../../interfaces/products/products.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomepageService {
  apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // ฟังก์ชันสำหรับดึงข้อมูลสินค้าทั้งหมด
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  // ฟังก์ชันสำหรับดึงข้อมูลสินค้าโดยใช้ id
  getProductById(id: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/${id}`);
  }

  // ฟังก์ชันสำหรับกดถูกใจสินค้า
  likeProduct(userId: number, productId: number): Observable<any> {
    const body = { userId, productId }; // ข้อมูลที่ส่งไปยัง API
    console.log('Sending data:', body); // ตรวจสอบข้อมูลที่ส่งไปยัง API
    return this.http.post(`${this.apiUrl}/favourite`, body); // ส่งคำขอ POST
  }
  // ดึงสินค้าจากรายการโปรด โดยใช้ userId และ productId
  getLikedProduct(userId: number, productId: number): Observable<Product> {
    const params = {
      userId: userId.toString(),
      productId: productId.toString(),
    };
    return this.http.get<Product>(`${this.apiUrl}/favourites`, { params });
  }
}
