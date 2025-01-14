import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItemCountSubject = new BehaviorSubject<number>(0); // Observable for cart item count
  cartItemCount$ = this.cartItemCountSubject.asObservable();

  constructor(private http: HttpClient) { }

  apiUrl = 'http://localhost:5000/api';

  addItemToCart(data: any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/addToCart`, data, { withCredentials: true })
  }
  getProductOnCart(userId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/itemsOnCart/${userId}`, { withCredentials: true })
  }
  getCartById(userId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cart/${userId}`, { withCredentials: true })
  }
  removeProductOnCart(productId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteItemFromCart/${productId}`, { withCredentials: true })
  }
  removeWithoutRestock(productId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteItemWithoutRestock/${productId}`, { withCredentials: true })
  }
  increaseProductOnCart(data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/increaseProductOnCart`, data, { withCredentials: true })
  }
  decreaseProductOnCart(data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/decreaseProductOnCart`, data, { withCredentials: true })
  }
  deleteCart(userId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/cart/${userId}`, { withCredentials: true })
  }
  initialCart(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/initialCart`, data, { withCredentials: true })
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
