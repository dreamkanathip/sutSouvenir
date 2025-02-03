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
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gender: ['', [Validators.required]],
      role: ['ADMIN', [Validators.required]],
    });
  }

  submit(): void {
    const customSwal = Swal.mixin({
      customClass: {
        popup: 'title-swal',
        confirmButton: 'text-swal',
        cancelButton: 'text-swal',
      },
    });

    if (this.form.invalid) {
      customSwal.fire(
        'ไม่สามารถลงทะเบียนได้',
        'กรุณากรอกข้อมูลให้ครบถ้วน',
        'error'
      );
      return;
    }

    const user = this.form.getRawValue();

    customSwal
      .fire({
        title: 'คุณต้องการบันทึกการลงทะเบียนหรือไม่?',
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        cancelButtonText: 'ยกเลิก',
        icon: 'warning',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.http
            .post('http://localhost:5000/api/register', user, {
              withCredentials: true,
            })
            .subscribe(
              () => {
                customSwal
                  .fire({
                    icon: 'success',
                    title: 'ลงทะเบียนสำเร็จ!',
                    text: 'บัญชีผู้ดูแลระบบของคุณพร้อมใช้งานแล้ว',
                    confirmButtonText: 'ตกลง',
                  })
                  .then(() => {
                    this.form.reset();
                    this.router.navigate(['/superadmin/dashboard']);
                    window.location.reload(); // รีเฟรชหน้า
                  });
              },
              (error) => {
                console.error('เกิดข้อผิดพลาดในการลงทะเบียน:', error);
                customSwal.fire({
                  icon: 'error',
                  title: 'ข้อผิดพลาด',
                  text:
                    error.error?.message ||
                    'ไม่สามารถลงทะเบียนได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง',
                });
              }
            );
        }
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
