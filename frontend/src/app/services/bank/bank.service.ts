import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DestBank } from '../../interfaces/bank/dest-bank';
import { catchError, Observable, throwError } from 'rxjs';

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

  updateDestBank(
    bankId: number,
    updatedBank: {
      bank: string;
      bankNumber: string;
      name: string;
      branch: string;
    }
  ): Observable<any> {
    console.log(bankId);
    return this.http.put(`${this.apiUrl}/destBank/${bankId}`, updatedBank).pipe(
      catchError((error) => {
        console.error(
          `เกิดข้อผิดพลาดในการอัปเดตธนาคารปลายทาง ID: ${bankId}`,
          error
        );
        return throwError(
          () =>
            new Error('ไม่สามารถอัปเดตธนาคารปลายทางได้ กรุณาลองใหม่อีกครั้ง.')
        );
      })
    );
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
