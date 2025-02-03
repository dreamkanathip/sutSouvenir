import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.css'],
})
export class RegisterAdminComponent implements OnInit {
  form!: FormGroup;
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: [
        '',
        [Validators.required, Validators.minLength(2)], // ตรวจสอบให้มีความยาวขั้นต่ำ 2 ตัวอักษร
      ],
      lastName: [
        '',
        [Validators.required, Validators.minLength(2)], // ตรวจสอบให้มีความยาวขั้นต่ำ 2 ตัวอักษร
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(6)], // ตรวจสอบให้มีความยาวขั้นต่ำ 6 ตัวอักษร
      ],
      gender: ['', [Validators.required]], // ฟิลด์เพศที่บังคับกรอก
      role: ['ADMIN', [Validators.required]], // ฟิลด์ role ที่ถูกบังคับค่าเป็น ADMIN
    });
  }

  submit(): void {
    const customSwal = Swal.mixin({
      customClass:{
        popup: "title-swal",
        confirmButton: "text-swal",
      },
    });
    if (this.form.invalid) {
      // แสดงข้อความแจ้งเตือนเมื่อฟอร์มไม่สมบูรณ์
      customSwal.fire('ไม่สามารถลงทะเบียนได้', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
      return;
    }

    const user = this.form.getRawValue(); // ดึงค่าจากฟอร์ม
    console.log(user);

    this.http
      .post('http://localhost:5000/api/register', user, {
        withCredentials: true,
      })
      .subscribe(
        () => {
          customSwal.fire(
            'ลงทะเบียนสำเร็จ',
            'บัญชีผู้ดูแลระบบของคุณพร้อมใช้งานแล้ว',
            'success'
          );
          this.router.navigate(['/superadmin/dashboard']); // เปลี่ยนเส้นทางไปยังหน้าเข้าสู่ระบบเมื่อสำเร็จ
        },
        (err) => {
          // จัดการข้อผิดพลาดเฉพาะ (ถ้ามีการแจ้งจาก API)
          if (err.error && err.error.message) {
            customSwal.fire('ลงทะเบียนไม่สำเร็จ', err.error.message, 'error');
          } else {
            // ข้อความแสดงข้อผิดพลาดทั่วไป
            customSwal.fire(
              'เกิดข้อผิดพลาด',
              'ไม่สามารถลงทะเบียนได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง',
              'error'
            );
          }
        }
      );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword; // แสดง/ซ่อนรหัสผ่าน
  }
}
