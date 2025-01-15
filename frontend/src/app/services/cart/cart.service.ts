import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItemCountSubject = new BehaviorSubject<number>(0); // Observable for cart item count
  cartItemCount$ = this.cartItemCountSubject.asObservable();

  constructor(private http: HttpClient) { }
  
  private getAuthHeaders(): HttpHeaders {
      const token = localStorage.getItem('jwt'); // ดึง token จาก localStorage
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
  getProductOnCart(userId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/itemsOnCart/${userId}`, 
      {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    })
  }
  getCartById(userId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cart/${userId}`, 
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
  updateCartItemCount(userId: any): void {
    this.getProductOnCart(userId).subscribe((res) => {
      if(res.message == "Cart not found") {
        this.cartItemCountSubject.next(0);
      } else {
        this.cartItemCountSubject.next(res.length);
      }
     });
  }
}
