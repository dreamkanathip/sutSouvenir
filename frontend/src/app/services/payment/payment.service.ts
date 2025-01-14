import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // สำหรับเรียก API
import { Observable } from 'rxjs'; // ใช้สำหรับกำหนดประเภทข้อมูลที่ดึงมา

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = 'http://localhost:5000/api'; // URL ของ backend API

  constructor(private http: HttpClient) {}

  // ฟังก์ชันสำหรับดึงข้อมูล payment
  getPayments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/allPayment`);
  }
}
