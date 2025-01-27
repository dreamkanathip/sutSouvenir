import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service'; // ปรับ path ให้เหมาะสม

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css'], // แก้ styleUrl เป็น styleUrls
})
export class NavbarAdminComponent {
  authenticated: boolean = false; // ตัวแปรเพื่อติดตามสถานะล็อกอิน
  isCollapsed: boolean = false; // ตัวแปรที่เก็บสถานะของ sidebar

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

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed; // สลับสถานะ
    console.log('Sidebar toggled!'); // เช็คว่าฟังก์ชันทำงาน
  }
}
