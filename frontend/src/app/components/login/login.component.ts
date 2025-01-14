import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth/auth.service';

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
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: '',
      password: '',
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
      Swal.fire('ไม่สามารถเข้าสู่ระบบได้', 'กรอกข้อมูลให้ครบถ้วน', 'error'); // แก้ข้อความเป็นภาษาไทย
    } else if (!this.ValidateEmail(user.email)) {
      Swal.fire('ไม่สามารถเข้าสู่ระบบได้', 'กรุณากรอกอีเมลให้ถูกต้อง', 'error'); // แก้ข้อความเป็นภาษาไทย
    } else {
      this.authService.login(user)
        .subscribe(
          (res) => {
            Swal.fire('เข้าสู่ระบบสำเร็จ', 'ยินดีต้อนรับ', 'success'); // แก้ข้อความเป็นภาษาไทย
            this.router.navigate(['/home']);
            this.authService.storeToken(res.token);
          },
          (err) => {
            Swal.fire(
              'ไม่สามารถเข้าสู่ระบบได้',
              'อีเมล หรือ รหัสผ่านไม่ถูกต้อง',
              'error'
            ); // แสดงข้อความว่า "รหัสผ่านผิด"
          }
        );
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
