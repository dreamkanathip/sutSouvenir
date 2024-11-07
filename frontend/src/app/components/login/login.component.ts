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
      Swal.fire('Error', 'Please enter all the fields', 'error');
    } else if (!this.ValidateEmail(user.email)) {
      Swal.fire('Error', 'Please enter a valid email address', 'error');
    } else {
      this.http
        .post('http://localhost:5000/api/login', user, {
          withCredentials: true,
        })
        .subscribe(
          (res) => {
            Swal.fire('Success', 'Login successful!', 'success');
            this.router.navigate(['/favorite']);
          },
          (err) => {
            Swal.fire('Error', err.error.message, 'error');
          }
        );
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
