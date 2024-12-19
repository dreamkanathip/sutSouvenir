import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from '../../interfaces/order/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  apiUrl = 'http://localhost:5000/api';

  uploadPayment(data: any): Observable<Payment> {
      return this.http.post<Payment>(`${this.apiUrl}/payment`, data)
  }
}
