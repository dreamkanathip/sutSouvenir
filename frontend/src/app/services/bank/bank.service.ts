import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BankService {
  apiUrl = 'http://localhost:5000/api'; // URL ของ API

  constructor(private http: HttpClient) {}

  // ฟังก์ชันสำหรับดึงข้อมูลธนาคารปลายทาง
  getDestBank() {
    return this.http.get<any>(`${this.apiUrl}/destBank`);
  }

  // ฟังก์ชันสำหรับดึงข้อมูลธนาคารต้นทาง
  getOriginBank() {
    return this.http.get<any>(`${this.apiUrl}/originBank`);
  }

  // ฟังก์ชันสำหรับเพิ่มข้อมูลธนาคารปลายทาง
  addDestBank(data: any) {
    return this.http.post<any>(`${this.apiUrl}/destBank`, data);
  }

  // ฟังก์ชันสำหรับเพิ่มข้อมูลธนาคารต้นทาง
  addOriginBank(data: any) {
    return this.http.post<any>(`${this.apiUrl}/originBank`, data);
  }

  // ฟังก์ชันสำหรับดึงข้อมูลสำหรับการอัปเดตธนาคารปลายทาง
  updateDestBank(id: number) {
    return this.http.get<any>(`${this.apiUrl}/destBank/${id}`);
  }

  // ฟังก์ชันสำหรับดึงข้อมูลสำหรับการอัปเดตธนาคารต้นทาง
  updateOriginBank(id: number) {
    return this.http.get<any>(`${this.apiUrl}/originBank/${id}`);
  }

  // ฟังก์ชันสำหรับลบข้อมูลธนาคารปลายทาง
  deleteDestBank(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/destBank/${id}`);
  }

  // ฟังก์ชันสำหรับลบข้อมูลธนาคารต้นทาง
  deleteOriginBank(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/originBank/${id}`);
  }
}
