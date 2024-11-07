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
      gender: ['', [Validators.required]], // Added gender field
    });
  }

  submit(): void {
    if (this.form.invalid) {
      // แสดงข้อความผิดพลาดหากฟอร์มไม่ถูกต้อง
      Swal.fire('Error', 'Please fill out all required fields.', 'error');
      return;
    }

    const user = this.form.getRawValue(); // นำค่าจากฟอร์มมาเป็นอ็อบเจกต์
    console.log(user);

    // ส่งข้อมูลไปที่ API
    this.http
      .post('http://localhost:5000/api/register', user, {
        withCredentials: true,
        responseType: 'text',
      })
      .subscribe(
        (response: string) => {
          // เช็คข้อความที่ได้รับ
          if (response === 'Register Success') {
            Swal.fire('Success', 'Registration Successful', 'success');
            this.router.navigate(['/login']);
          } else {
            Swal.fire('Error', response, 'error');
          }
        },
        (err) => {
          console.error('Error:', err);
          Swal.fire('Error', 'An error occurred during registration.', 'error');
        }
      );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // การแสดงข้อผิดพลาดของฟอร์ม
  get firstName() {
    return this.form.get('firstName');
  }
  get lastName() {
    return this.form.get('lastName');
  }
  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }
  get gender() {
    return this.form.get('gender');
  }
}
