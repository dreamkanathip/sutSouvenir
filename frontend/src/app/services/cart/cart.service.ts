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
    return this.http.post<any>(`${this.apiUrl}/addToCart`, data)
  }
  getProductOnCart(userId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/itemsOnCart/${userId}`)
  }
  getCartById(userId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cart/${userId}`)
  }
  removeProductOnCart(data: any) {
    return this.http.delete<any>(`${this.apiUrl}/deleteItemFromCart`, { body: data })
  }
  increaseProductOnCart(data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/increaseProductOnCart`, data)
  }
  decreaseProductOnCart(data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/decreaseProductOnCart`, data)
  }
  deleteCart(userId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/cart/${userId}`)
  }
  initialCart(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/initialCart`, data)
  }
  updateCartItemCount(userId: number): void {
    this.getProductOnCart(userId).subscribe((res) => {
      if(res) {
        this.cartItemCountSubject.next(res.length);
      }
    });
  }
}
