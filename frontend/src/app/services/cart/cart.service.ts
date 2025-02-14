import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItemCountSubject = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCountSubject.asObservable();

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any) { }
  
  getItem(key: string): string | null {
      if (isPlatformBrowser(this.platformId)) {
        return localStorage.getItem(key);
      }
      return null;
    }
  
    private getAuthHeaders(): HttpHeaders {
      const token = localStorage.getItem('jwt')
      return new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '', // ใส่ token ใน header ถ้ามี
      });
    }

  apiUrl = 'http://localhost:5000/api';

  addItemToCart(data: any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/addToCart`, data, 
      {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    })
  }
  getProductOnCart(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/itemsOnCart`, 
      {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    })
  }
  getCartById(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cart`, 
      {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    })
  }
  removeProductOnCart(productId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteItemFromCart/${productId}`, 
      {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    })
  }
  removeWithoutRestock(productId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteItemWithoutRestock/${productId}`, 
      {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    })
  }
  increaseProductOnCart(data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/increaseProductOnCart`, data, 
      {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    })
  }
  decreaseProductOnCart(data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/decreaseProductOnCart`, data, 
      {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    })
  }
  deleteCart(userId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/cart/${userId}`, 
      {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    })
  }
  initialCart(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/initialCart`, data, 
      {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    })
  }
  updateCartItemCount(): void {
    this.getProductOnCart().subscribe((res) => {
      if(res.message == "Cart not found") {
        this.cartItemCountSubject.next(0);
      } else {
        this.cartItemCountSubject.next(res.length);
      }
     });
  }
  
}
