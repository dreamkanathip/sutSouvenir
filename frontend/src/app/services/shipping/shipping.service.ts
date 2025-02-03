import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Shipping } from '../../interfaces/shipping/shipping.model';

@Injectable({
  providedIn: 'root',
})
export class ShippingService {
  [x: string]: any;

  constructor(private http: HttpClient) {}

  apiUrl = 'http://localhost:5000/api';

  createShipping(data: any): Observable<Shipping> {
    return this.http.post<any>(`${this.apiUrl}/shipping`, data);
  }

  getAllShippings(): Observable<Shipping[]> {
    return this.http.get<any[]>(`${this.apiUrl}/shippings`);
  }

  getShippingById(id: any): Observable<Shipping> {
    return this.http.get<any>(`${this.apiUrl}/shipping/${id}`);
  }

  updateShipping(id: any, data: any): Observable<Shipping> {
    return this.http.put<any>(`${this.apiUrl}/shipping/${id}`, data);
  }

  deleteShipping(id: any): Observable<Shipping> {
    return this.http.delete<any>(`${this.apiUrl}/shipping/${id}`);
  }
}
