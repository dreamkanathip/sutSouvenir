import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router'; // เพิ่ม Router สำหรับการนำทาง
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStatusSubject = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatusSubject.asObservable();

  private isBrowser: boolean;
  private apiUrl = 'http://localhost:5000/api'; // ตรวจสอบให้แน่ใจว่า URL ถูกต้อง

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router // Inject Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId); // ตรวจสอบว่าเป็นเบราว์เซอร์
    setTimeout(() => {
      this.checkAuthentication();
    }, 0); // ใช้ 0 ms เพื่อให้ทำงานในรอบถัดไป
  }

  checkAuthentication(): void {
    if (this.isBrowser) {
      // ตรวจสอบว่าเป็นเบราว์เซอร์ก่อน
      const token = localStorage.getItem('jwt');
      console.log('Token in localStorage:', token); // แสดงค่า token ใน console

      if (token) {
        this.authStatusSubject.next(true); // ถ้ามี token กำหนดสถานะเป็น true
      } else {
        this.authStatusSubject.next(false); // ถ้าไม่มี token กำหนดสถานะเป็น false
      }
    }
  }

  // ฟังก์ชันล็อกอิน
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, credentials, { withCredentials: true })
      .pipe(
        tap((response) => {
          if (this.isBrowser) {
            // ตรวจสอบว่าเป็นเบราว์เซอร์ก่อน
            const token = response.token;
            localStorage.setItem('jwt', token);

            const storedToken = localStorage.getItem('jwt');
            console.log('Token in localStorage:', storedToken);

            this.authStatusSubject.next(true); // อัปเดตสถานะการล็อกอิน
          }
        })
      );
  }

  // ฟังก์ชันออกจากระบบ
  logout(): void {
    this.http
      .post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .subscribe(() => {
          this.clearToken(); // ลบ token ออกจาก localStorage
          this.authStatusSubject.next(false); // เปลี่ยนสถานะการ login เป็น false
          this.router.navigate(['/login']); // นำทางไปหน้า login
        },
        (error) => {
          console.error('Logout error', error); // หากมีข้อผิดพลาดในการออกจากระบบ
          this.clearToken(); // ลบ token ออกทันทีหากมีข้อผิดพลาด
          this.authStatusSubject.next(false); // เปลี่ยนสถานะการ login เป็น false
          this.router.navigate(['/login']); // นำทางไปหน้า login
        }
      );
  }

  // ฟังก์ชันดึง token จาก localStorage
  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('jwt') : null; // ตรวจสอบว่าเป็นเบราว์เซอร์ก่อน
  }

  // ฟังก์ชันเก็บ token ใน localStorage
  setToken(token: string): void {
    if (this.isBrowser) {
      // ตรวจสอบว่าเป็นเบราว์เซอร์ก่อน
      localStorage.setItem('jwt', token);
    }
  }

  // ฟังก์ชันลบ token ออกจาก localStorage
  clearToken(): void {
    if (this.isBrowser) {
      // ตรวจสอบว่าเป็นเบราว์เซอร์ก่อน
      localStorage.removeItem('jwt');
    }
  }

  // ฟังก์ชันสร้าง HTTP headers พร้อม token สำหรับส่งไปยัง API
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  // ฟังก์ชันตรวจสอบสถานะการล็อกอินจาก API
  checkUserStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/status`, {
      headers: this.getAuthHeaders(), // ส่ง headers ที่มี token
      withCredentials: true,
    });
  }


}
