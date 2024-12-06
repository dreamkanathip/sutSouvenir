import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { UserModel } from '../../interfaces/user/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{

  user?: UserModel
  editedUser: FormGroup

  ModalOpen = false

  constructor(private userService: UserService, private fb: FormBuilder,) {
    this.editedUser = this.fb.group({
      id: 0,
      firstname: '',
      lastname: '',
      email: '',
      gender: '',
      password: '',
      role: '',
      picture: '',
      enabled: true,
    })
  }

  ngOnInit(): void {
    this.getUserData()
  }

  getUserData() {
    this.userService.getUserData().subscribe({
      next: (result: UserModel) => {
        if (result) {
          console.log(result)
          this.user = result;
          this.editedUser.patchValue({
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            gender: result.gender,
          });
        }
      },
      error: (err) => {
        console.error('Error fetching user data', err);
      }
    });
  }

  showGender(): string {
    if (this.user?.gender === 'Male') {
      return 'ชาย';
    } else if (this.user?.gender === 'Female') {
      return 'หญิง';
    }
    return 'อื่นๆ';
  }

  onSubmit(): void {
    if (this.editedUser.valid) {
      const updatedData = this.editedUser.value;
      this.userService.updateUser(updatedData).subscribe({
        next: (response) => {
          console.log('ข้อมูลถูกอัปเดตสำเร็จ:', response);
          this.user = { ...this.user, ...updatedData }; // อัปเดตข้อมูลใน UI
          this.closeModal();
        },
        error: (error) => {
          console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล:', error);
        },
      });
    }
  }
  
  openModal() {
    this.ModalOpen = true;
  }

  closeModal(): void {
    this.ModalOpen = false
  }

}
