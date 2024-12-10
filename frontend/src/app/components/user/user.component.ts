import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { UserModel } from '../../interfaces/user/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
<<<<<<< HEAD
import Swal from 'sweetalert2';
=======

>>>>>>> d12c5a371915efb3d7665d6f38ee5ea1086f5598

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{

  user?: UserModel
  editedUser: FormGroup
  passwordForm: FormGroup

  ModalOpen = false
  dataModalOpen = false
  emailModalOpen = false
  passwordModalOpen = false

  constructor(private userService: UserService, private fb: FormBuilder,) {
    this.editedUser = this.fb.group({
      id: 0,
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', [Validators.required]],
    })

    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      repeatNewPassword: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.getUserData()
  }

  getUserData() {
    this.userService.getUserData().subscribe({
      next: (result: UserModel) => {
        if (result) {
          console.log("User:", result)
          this.user = result;
          this.editUserUpdate()
        }
      },
      error: (err) => {
        console.error('Error fetching user data', err);
      }
    });
  }

  editUserUpdate() {
    this.editedUser.patchValue({
      firstName: this.user?.firstName,
      lastName: this.user?.lastName,
      email: this.user?.email,
      gender: this.user?.gender,
    });
  }

  showGender() {
    switch (this.user?.gender) {
      case 'Male': return 'ชาย';
      case 'Female': return 'หญิง';
      case 'Other': return 'อื่นๆ';
      default: return 'ไม่ระบุ';
    }
  }
  
  showFullName(): string {
    if (this.user?.firstName && this.user?.lastName) {
      return `${this.user.firstName} ${this.user.lastName}`;
    }
    return "NAME ERROR";
  }
  

  onDataSubmit(): void {
    if (this.editedUser.invalid) {
      Swal.fire({
        title: "กรุณากรอกแบบฟอร์มให้ครบถ้วน",
        icon: "error",
      })
      return;
    }
    const updatedData = this.editedUser.value;
      Swal.fire({
        title: "ต้องการบันทึกการเปลี่ยนแปลง?",
        showCancelButton: true,
        confirmButtonText: "บันทึก",
        cancelButtonText: "ยกเลิก",
        icon: "warning",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "กำลังบันทึกข้อมูล...",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          this.userService.updateUser(updatedData).subscribe({
            next: () => {
              Swal.close();
              Swal.fire({
                icon: "success",
                title: "Success",
                text: "ทำการบันทึกข้อมูลเรียบร้อยแล้ว",
                showConfirmButton: true,
              });
              this.user = { ...this.user, ...updatedData }; // อัปเดตข้อมูลใน UI
              this.editUserUpdate()
              this.dataModal();
              
            },
            error: (error) => {
              Swal.close();
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "บันทึกข้อมูลไม่สำเร็จ โปรดลองอีกครั้งในภายหลัง",
                showConfirmButton: true,
              });
              console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล:', error);
            }
          });
        }
      })
  }

  onEmailSubmit(){
    if (this.editedUser.invalid) {
      Swal.fire({
        title: "กรุณากรอกแบบฟอร์มให้ครบถ้วน",
        icon: "error",
      })
      return;
    }
    const updatedData = this.editedUser.value;
    Swal.fire({
      title: "ต้องการบันทึกการเปลี่ยนแปลง?",
      text: "หากต้องการเข้าใช้งานอีกครั้ง กรุณาใช้งานอีเมลใหม่นี้",
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      icon: "warning",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "กำลังบันทึกข้อมูล...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.userService.updateUser(updatedData).subscribe({
          next: () => {
            Swal.close();
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "ทำการบันทึกข้อมูลเรียบร้อยแล้ว",
              showConfirmButton: true,
            });
            this.user = { ...this.user, ...updatedData }; // อัปเดตข้อมูลใน UI
            this.editUserUpdate()
            this.dataModal();
            
          },
          error: (error) => {
            Swal.close();
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "บันทึกข้อมูลไม่สำเร็จ โปรดลองอีกครั้งในภายหลัง",
              showConfirmButton: true,
            });
            console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล:', error);
          }
        });
      }
    })
  }

  onPasswordSubmit(){
    if (this.passwordForm.invalid) {
      Swal.fire({
        title: "กรุณากรอกแบบฟอร์มให้ครบถ้วน",
        icon: "error",
      })
      return;
    }

    const { oldPassword, newPassword, repeatNewPassword } = this.passwordForm.value;

    if (newPassword !== repeatNewPassword) {
      Swal.fire({
        title: "กรุณากรอกรหัสผ่านใหม่ทั้งสองช่องให้ตรงกัน",
        icon: "error",
      })
      return;
    }

    const passwordData = {
      oldPassword,
      newPassword,
    };

    try {
      Swal.fire({
        title: "ต้องการบันทึกการเปลี่ยนแปลง?",
        showCancelButton: true,
        confirmButtonText: "บันทึก",
        cancelButtonText: "ยกเลิก",
        icon: "warning",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "กำลังบันทึกข้อมูล...",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          this.userService.updateUserPassword(passwordData).subscribe({
            next: () => {
              Swal.close();
              Swal.fire({
                icon: "success",
                title: "Success",
                text: "ทำการบันทึกข้อมูลเรียบร้อยแล้ว",
                showConfirmButton: true,
              });
              this.passwordForm.reset()
              this.passwordModal();
            },
            error: (error) => {
              Swal.close();
              if (error.status === 403) {
                Swal.fire({
                  icon: "error",
                  title: "รหัสผ่านไม่ถูกต้อง",
                  text: "กรุณาตรวจสอบรหัสผ่านเก่าของคุณ",
                  showConfirmButton: true,
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: "บันทึกข้อมูลไม่สำเร็จ โปรดลองอีกครั้งในภายหลัง",
                  showConfirmButton: true,
                });
              }
              console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล:', error);
            }
            
          })
        }
      })
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "บันทึกข้อมูลไม่สำเร็จ โปรดลองอีกครั้งในภายหลัง",
        showConfirmButton: true,
      });
      console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล:', error);
    }
  }
  
  dataModal() {
    this.ModalOpen = !this.ModalOpen
    this.dataModalOpen = !this.dataModalOpen;
  }

  emailModal() {
    this.ModalOpen = !this.ModalOpen
    this.emailModalOpen = !this.emailModalOpen
  }

  passwordModal(){
    this.ModalOpen = !this.ModalOpen
    this.passwordModalOpen = !this.passwordModalOpen
  }

}
