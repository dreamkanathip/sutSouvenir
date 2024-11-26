import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStatusSubject = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatusSubject.asObservable();

  private isBrowser: boolean;
  apiUrl = 'http://localhost:5000/api'; // ตรวจสอบให้แน่ใจว่า URL ถูกต้อง

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.checkAuthentication(); // เช็คสถานะการ login เมื่อเริ่มต้น
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, credentials, { withCredentials: true })
      .pipe(
        // เพิ่ม { withCredentials: true } เพื่อส่งคุกกี้
        tap((response) => {
          this.authStatusSubject.next(true); // กำหนดสถานะการ login เป็น true
        })
      );
  }

  logout(): void {
    // คำขอ logout ที่จะทำการลบ JWT cookie
    this.http
      .post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .subscribe(() => {
        // ใช้ route logout แทน check-auth
        this.authStatusSubject.next(false); // เปลี่ยนสถานะการ login เป็น false
      });
  }

  checkAuthentication(): void {
    this.http
      .get<any>(`${this.apiUrl}/auth-check`, { withCredentials: true }) // ตรวจสอบคุกกี้
      .subscribe(
        (response) => {
          this.authStatusSubject.next(true); // ผู้ใช้เข้าสู่ระบบ
        },
        (error) => {
          this.authStatusSubject.next(false); // ผู้ใช้ไม่ได้เข้าสู่ระบบ
          console.error('Authentication failed', error);
        }
      );
  }

  isAuthenticated(): boolean {
    this.checkAuthentication(); // เรียกตรวจสอบสถานะการ login
    return this.authStatusSubject.getValue(); // ส่งค่าปัจจุบันของสถานะการ login
  }
}
