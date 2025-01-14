import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service'; // import UserService
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.css'],
})
export class SuperAdminDashboardComponent implements OnInit {
  users: any[] = []; // เก็บข้อมูลผู้ใช้ทั้งหมด
  filteredUsers: any[] = []; // เก็บข้อมูลผู้ใช้หลังจากกรองบทบาท
  pagedUsers: any[] = []; // เก็บข้อมูลผู้ใช้ในหน้าปัจจุบัน
  isLoading = false; // แสดงสถานะการโหลด
  selectedRole: string = 'ALL'; // ค่าเริ่มต้นของตัวกรองบทบาท

  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.checkAuthentication();

    // ตรวจสอบสถานะการล็อกอินจาก authStatus$
    this.authService.authStatus$.subscribe((status) => {
      console.log('Auth status:', status); // ตรวจสอบค่า status
      if (status) {
        this.getUsers(); // ถ้าผู้ใช้ล็อกอินแล้ว ดึงข้อมูลผู้ใช้
      } else {
        console.log('User is not logged in.');
      }
    });
  }

  // ดึงข้อมูลผู้ใช้ทั้งหมดจาก UserService
  getUsers(): void {
    this.isLoading = true; // แสดงสถานะการโหลด
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response; // เก็บข้อมูลที่ได้จาก API ลงในตัวแปร users
        this.filterUsers(); // เรียกกรองบทบาทผู้ใช้หลังโหลดข้อมูล
        this.updatePagedUsers(); // แบ่งข้อมูลสำหรับการแสดงผล
        this.isLoading = false; // หยุดแสดงสถานะการโหลด
      },
      error: (err) => {
        console.error('Error fetching users:', err); // แสดงข้อผิดพลาดใน console
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลผู้ใช้ได้', 'error');
        this.isLoading = false; // หยุดแสดงสถานะการโหลด
      },
    });
  }

  // ฟังก์ชันกรองผู้ใช้ตามบทบาท
  filterUsers(): void {
    if (this.selectedRole === 'ALL') {
      this.filteredUsers = this.users; // แสดงทั้งหมด
    } else {
      this.filteredUsers = this.users.filter(
        (user) => user.role.toUpperCase() === this.selectedRole
      );
    }
    this.updatePagedUsers(); // เรียกการแบ่งข้อมูลเมื่อกรองเสร็จ
  }

  // ฟังก์ชันแบ่งข้อมูลที่แสดงผล
  updatePagedUsers(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedUsers = this.filteredUsers.slice(start, end);

    const emptyRows = this.itemsPerPage - this.pagedUsers.length;
    for (let i = 0; i < emptyRows; i++) {
      this.pagedUsers.push({
        firstname: '',
        lastname: '',
        email: '',
        gender: '',
        role: '',
      });
    }
  }

  loadPage(page: number) {
    this.currentPage = page;
    this.updatePagedUsers(); // เรียกฟังก์ชันเพื่ออัปเดตข้อมูลหน้าปัจจุบัน
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.filteredUsers.length) {
      this.loadPage(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }

  // ฟังก์ชันลบผู้ใช้
  deleteUser(userId: number): void {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการลบผู้ใช้นี้หรือไม่',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true; // แสดงสถานะการโหลดขณะลบ
        this.userService.deleteUser(userId).subscribe({
          next: () => {
            // แสดงข้อความสำเร็จ
            Swal.fire({
              title: 'สำเร็จ',
              text: 'ลบผู้ใช้สำเร็จ',
              icon: 'success',
              confirmButtonColor: '#3085d6',
            });

            // โหลดข้อมูลใหม่เพื่ออัปเดตรายการผู้ใช้
            this.getUsers();
          },
          error: (err) => {
            // แสดงข้อผิดพลาดหากการลบไม่สำเร็จ
            console.error('Error deleting user:', err);
            Swal.fire({
              title: 'เกิดข้อผิดพลาด',
              text: 'ไม่สามารถลบผู้ใช้ได้',
              icon: 'error',
              confirmButtonColor: '#3085d6',
            });
          },
          complete: () => {
            // ซ่อนสถานะการโหลด
            this.isLoading = false;
          },
        });
      }
    });
  }
}
