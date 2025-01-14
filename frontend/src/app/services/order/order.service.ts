import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductOnOrder } from '../../interfaces/order/product-on-order';
import { Order } from '../../interfaces/order/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }
  private orderId: number = 0;

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

  cancelOrder(id: number, order: any) : Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/cancelOrder/${id}`, order)
  }

  getProductOnOrder(): Observable<ProductOnOrder[]> {
    return this.http.get<ProductOnOrder[]>(`${this.apiUrl}/productsOnOrders`)
  }
  setOrderId(id: number): void {
    this.orderId = id;
  }

  getOrderId(): number {
    return this.orderId;
  }
}
