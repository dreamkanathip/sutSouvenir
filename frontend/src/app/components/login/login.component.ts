import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: '',
      password: '',
      role: '',
    });
  }

  ValidateEmail(email: string): boolean {
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return email.match(validRegex) !== null;
  }

  submit(): void {
    let user = this.form.getRawValue();

    if (user.email == '' || user.password == '') {
      Swal.fire('ไม่สามารถเข้าสู่ระบบได้', 'กรอกข้อมูลให้ครบถ้วน', 'error');
    } else if (!this.ValidateEmail(user.email)) {
      Swal.fire('ไม่สามารถเข้าสู่ระบบได้', 'กรุณากรอกอีเมลให้ถูกต้อง', 'error');
    } else {
      this.http
        .post('http://localhost:5000/api/login', user, {
          withCredentials: true,
        })
        .subscribe(
          (res: any) => {
            const token = res.token;
            localStorage.setItem('jwt', token);
            Swal.fire('เข้าสู่ระบบสำเร็จ', 'ยินดีต้อนรับ', 'success');

            // ตรวจสอบ role และนำทางไปยังหน้าเหมาะสม
            if (res.role === 'SUPERADMIN') {
              this.router.navigate(['/superadmin/dashboard']);
            } else if (res.role === 'ADMIN') {
              this.router.navigate(['/admin/dashboard']);
            } else if (res.role === 'USER') {
              this.router.navigate(['/home']);
            } else {
              // ถ้าไม่มี role ที่ตรงกันให้แสดงข้อความหรือดำเนินการอื่น
              Swal.fire('ข้อผิดพลาด', 'บทบาทผู้ใช้ไม่ถูกต้อง', 'error');
            }
          },
          (err) => {
            Swal.fire(
              'ไม่สามารถเข้าสู่ระบบได้',
              'อีเมล หรือ รหัสผ่านไม่ถูกต้อง',
              'error'
            );
          }
        );
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
