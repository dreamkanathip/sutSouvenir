import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service'; // ปรับ path ให้เหมาะสม

@Component({
  selector: 'app-navbar-super-admin',
  templateUrl: './navbar-super-admin.component.html',
  styleUrl: './navbar-super-admin.component.css',
})
export class NavbarSuperAdminComponent {
  authenticated: boolean = false; // ตัวแปรเพื่อติดตามสถานะล็อกอิน

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService // ตรวจสอบว่ามี AuthService
  ) {}

  logout(): void {
    // ทำคำขอไปยัง backend เพื่อจัดการ logout
    this.http
      .post('http://localhost:5000/api/logout', {}, { withCredentials: true })
      .subscribe({
        next: () => {
          // ตั้งค่า authenticated เป็น false เพื่อบอกว่าผู้ใช้ไม่ได้ล็อกอิน
          this.authenticated = false;

          // ล้างข้อมูลใน authService (หรือจัดการสถานะอื่น ๆ ถ้ามี)
          this.authService.logout();

          // เปลี่ยนเส้นทางกลับไปยังหน้า Login
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Logout failed', err);
        },
      });
  }
}
