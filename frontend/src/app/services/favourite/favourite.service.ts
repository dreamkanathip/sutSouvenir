// favourite.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../interfaces/products/products.model'; // นำเข้า Product interface

@Injectable({
  providedIn: 'root',
})
export class FavouriteService {
  apiUrl = 'http://localhost:5000/api'; // URL ของ API

  constructor(private http: HttpClient) {}

  // ฟังก์ชันดึงสินค้าที่ถูกกดถูกใจโดยใช้ userId
  getLikedProducts(userId: number): Observable<Product[]> {
    const params = new HttpParams().set('userId', userId.toString()); // สร้าง query parameter สำหรับ userId
    return this.http.get<Product[]>(`${this.apiUrl}/favourites`, { params }); // ส่งคำขอ HTTP ไปที่ API
  }

  // ฟังก์ชันลบสินค้าจากรายการโปรด
  removeFromFavourites(userId: number, productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/favourites`, {
      params: new HttpParams()
        .set('userId', userId.toString())
        .set('productId', productId.toString()),
    });
  }
}
