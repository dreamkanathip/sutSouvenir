// favourite.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../interfaces/products/products.model'; // นำเข้า Product interface
import { FavouriteModel, FavouriteResponse } from '../../interfaces/favourite/favourite.model';

@Injectable({
  providedIn: 'root',
})
export class FavouriteService {
  private favItemCountSubject = new BehaviorSubject<number>(0);
  favItemCount$ = this.favItemCountSubject.asObservable();
  apiUrl = 'http://localhost:5000/api'; // URL ของ API

  userId: Number = 1

  favouritesList: FavouriteResponse[] = []

  productList: Product[] = []

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt'); // ดึง token จาก localStorage
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '', // ใส่ token ใน header ถ้ามี
    });
  }

  likeProduct( product: Product) : Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/favourites`, { id: product.id}, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    });
  }

  // ฟังก์ชันดึงสินค้าที่ถูกกดถูกใจโดยใช้ userId
  getLikedProducts(): Observable<FavouriteResponse[]> {
    // const params = new HttpParams().set('userId', userId.toString()); // สร้าง query parameter สำหรับ userId
    return this.http.get<FavouriteResponse[]>(`${this.apiUrl}/favourites`, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    }); // ส่งคำขอ HTTP ไปที่ API
  }

  checkLikeProduct(productId: number): Observable<FavouriteModel> {
    return this.http.get<FavouriteModel>(`${this.apiUrl}/favourites/${productId}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    })
  }

  // ฟังก์ชันลบสินค้าจากรายการโปรด
  removeFromFavourites(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/favourites/${productId}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    });
  }

  loadLikedProducts(): void {
    this.getLikedProducts().subscribe(
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
    this.removeFromFavourites(productId).subscribe(
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

  updateFavItemCount(): void {
    this.getLikedProducts().subscribe((res) => {
      if(res.length === 0) {
        this.favItemCountSubject.next(0);
      } else {
        this.favItemCountSubject.next(res.length);
      }
     });
  }
}
