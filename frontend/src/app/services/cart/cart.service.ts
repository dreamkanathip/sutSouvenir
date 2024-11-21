import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

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
}
