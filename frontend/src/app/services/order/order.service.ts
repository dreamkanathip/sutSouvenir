import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductOnOrder } from '../../interfaces/order/product-on-order';
import { Order } from '../../interfaces/order/order';
import { AuthService } from '../auth/auth.service';
import { OrderStatus } from '../../interfaces/order/status';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}
  private orderId: number = 0;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt'); // ดึง token จาก localStorage
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '', // ใส่ token ใน header ถ้ามี
    });
  }
  apiUrl = 'http://localhost:5000/api';

  initialOrder(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/initialOrder`, data, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    });
  }

  addOrderDetail(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addOrderDetail`, data, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    });
  }

  getProductOnOrderById(id: any): Observable<ProductOnOrder[]> {
    return this.http.get<ProductOnOrder[]>(
      `${this.apiUrl}/productOnOrder/${id}`,
      {
        headers: this.getAuthHeaders(),
        withCredentials: true, // ส่งคุกกี้
      }
    );
  }

  cancelOrder(id: number, order: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/cancelOrder/${id}`, order, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    });
  }

  getProductOnOrder(): Observable<ProductOnOrder[]> {
    return this.http.get<ProductOnOrder[]>(`${this.apiUrl}/productsOnOrders`, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    });
  }
  getOrderStatusEnum(): Observable<OrderStatus> {
    return this.http.get<OrderStatus>(`${this.apiUrl}/order-status-enum`, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    });
  }
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    });
  }
  changeOrderStatus(data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/updateOrderStatus`, data);
  }

  getOrderById(orderId: number) {
    return this.http.get<any>(`${this.apiUrl}/order/${orderId}`);
  }

  setOrderId(id: number): void {
    this.orderId = id;
  }

  getOrderId(): number {
    return this.orderId;
  }
  confirmOrder(data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/confirmOrder`, data);
  }  
}
