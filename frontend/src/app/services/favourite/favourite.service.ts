// favourite.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../interfaces/products/products.model'; // นำเข้า Product interface
import { FavouriteModel, FavouriteResponse } from '../../interfaces/favourite/favourite.model';

@Injectable({
  providedIn: 'root',
})
export class FavouriteService {
  apiUrl = 'http://localhost:5000/api'; // URL ของ API

  userId: Number = 1

  favouritesList: FavouriteResponse[] = []

  productList: Product[] = []

  constructor(private http: HttpClient) {}

  likeProduct(userId: Number, product: Product) : Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/favourites/${userId}`, { id: product.id });
  }

  // ฟังก์ชันดึงสินค้าที่ถูกกดถูกใจโดยใช้ userId
  getLikedProducts(userId: Number): Observable<FavouriteResponse[]> {
    // const params = new HttpParams().set('userId', userId.toString()); // สร้าง query parameter สำหรับ userId
    return this.http.get<FavouriteResponse[]>(`${this.apiUrl}/favourites/${userId}`); // ส่งคำขอ HTTP ไปที่ API
  }

  checkLikeProduct(userId: number, productId: number): Observable<FavouriteModel> {
    return this.http.get<FavouriteModel>(`${this.apiUrl}/favourites/${userId}/${productId}`)
  }

  // ฟังก์ชันลบสินค้าจากรายการโปรด
  removeFromFavourites(userId: Number, productId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/favourites/${userId}/${productId}`);
  }

  loadLikedProducts(): void {
    this.getLikedProducts(this.userId).subscribe(
      (data) => {
        this.favouritesList = data;
        this.productList = []
        this.favouritesList.forEach((list) => {
          if (list.product) {
            this.productList.push(list.product);
          }
        })
      },
      (error) => {
        console.error('Error loading liked products', error);
      }
    );
  }

  removeFavourites(productId: number): void {
    this.removeFromFavourites(this.userId, productId).subscribe(
        (result) => {
          console.log("remove favourite success.")
          this.loadLikedProducts();
        },
        (error) => {
          console.error('Error removing from favourites', error);
        }
      );
  }

  getproductList() {
    return this.productList
  }
}
