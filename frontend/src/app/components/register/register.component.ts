import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  showPassword: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstname: [
        '',
        [Validators.required, Validators.minLength(2)], // ตรวจสอบให้มีความยาวขั้นต่ำ 2 ตัวอักษร
      ],
      lastname: [
        '',
        [Validators.required, Validators.minLength(2)], // ตรวจสอบให้มีความยาวขั้นต่ำ 2 ตัวอักษร
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(6)], // ตรวจสอบให้มีความยาวขั้นต่ำ 6 ตัวอักษร
      ],
      gender: ['', [Validators.required]], // Added gender field
    });
  }

  submit(): void {
    if (this.form.invalid) {
      // Display error message for all invalid fields
      Swal.fire('ไม่สามารถลงทะเบียนได้', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
      return;
    }

    const user = this.form.getRawValue(); // Get form data as an object
    console.log(user);

    this.http
      .post('http://localhost:5000/api/register', user, {
        withCredentials: true,
      })
      .subscribe(
        () => {
          Swal.fire('ลงทะเบียนสำเร็จ', 'บัญชีของคุรพร้อมใช้งานแล้ว', 'success');
          this.router.navigate(['/login']); // Redirect to login page on success
        },
        (err) => {
          // Handle specific server errors (if provided by API)
          if (err.error && err.error.message) {
            Swal.fire('ลงทะเบียนไม่สำเร็จ', err.error.message, 'error');
          } else {
            // ข้อความแสดงข้อผิดพลาดทั่วไปในกรณีเกิดข้อผิดพลาดที่ไม่คาดคิด
            Swal.fire(
              'เกิดข้อผิดพลาด',
              'ไม่สามารถลงทะเบียนได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง',
              'error'
            );
          }
        }
      );
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
