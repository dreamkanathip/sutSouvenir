import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductOnOrder } from '../../interfaces/order/product-on-order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  apiUrl = 'http://localhost:5000/api';

  initialOrder(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/initialOrder`, data)
  }

  addOrderDetail(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addOrderDetail`, data)
  }

  getProductOnOrderById(id: any) : Observable<ProductOnOrder[]> {
    return this.http.get<ProductOnOrder[]>(`${this.apiUrl}/productOnOrder/${id}`)
  }
}
