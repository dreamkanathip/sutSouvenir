import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs'; // ใช้สำหรับจับข้อผิดพลาด

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:5000/api/categories'; // URL ที่ใช้ดึงข้อมูลหมวดหมู่

  constructor(private http: HttpClient) {}

  // ฟังก์ชันดึงข้อมูลหมวดหมู่
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่:', error);
        return throwError(error); // ส่งข้อผิดพลาดให้กับ subscriber
      })
    );
  }
}
