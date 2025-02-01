import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { UserModel } from '../../interfaces/user/user.model';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AddressService } from '../../services/address/address.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{

  user?: UserModel
  editedUser: FormGroup
  passwordForm: FormGroup

  userId: number = 1

  ModalOpen = false
  dataModalOpen = false
  emailModalOpen = false
  passwordModalOpen = false

  defaultAddress! : any

  constructor(
    private userService: UserService,
    private addressService: AddressService,
    private authService: AuthService,
    private fb: FormBuilder, 
    private router: Router) {
    this.editedUser = this.fb.group({
      firstName: ['', [Validators.required, this.noWhitespaceValidator()]],
      lastName: ['', [Validators.required, this.noWhitespaceValidator()]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', [Validators.required]],
    })

    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      repeatNewPassword: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  ngOnInit(): void {
    this.getUserData()
    this.getDefaultAddress()
  }
  
  getUserData() {
    this.userService.getUserData().subscribe({
      next: (result: UserModel) => {
        if (result) {
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
      case 'male': return 'ชาย';
      case 'female': return 'หญิง';
      case 'other': return 'อื่นๆ';
      default: return 'ไม่ระบุ';
    }
  }
  
  showFullName(): string {
    if (this.user?.firstName && this.user?.lastName) {
      return `${this.user.firstName} ${this.user.lastName}`;
    }
    return "ไม่พบชื่อในระบบ";
  }
  
  getDefaultAddress() {
    this.addressService.getDefaultAddress().subscribe(result => {
      if (result) {
        this.defaultAddress = result.street + ' ตำบล' + result.subDistrict + ' อำเภอ' + result.district + ' ' + result.province
      }
    })
  }

  onDataSubmit(): void {
    const customSwal = Swal.mixin({
      customClass:{
        popup: "title-swal",
      },
    });
    if (this.editedUser.invalid) {
      customSwal.fire({
        title: "กรุณากรอกข้อมูลให้ถูกต้อง",
        icon: "error",
      })
      return;
    }
    const updatedData = this.editedUser.value;
      customSwal.fire({
        title: "ต้องการบันทึกการเปลี่ยนแปลง?",
        showCancelButton: true,
        confirmButtonText: "บันทึก",
        cancelButtonText: "ยกเลิก",
        icon: "warning",
      }).then((result) => {
        if (result.isConfirmed) {
          customSwal.fire({
            title: "กำลังบันทึกข้อมูล...",
            allowOutsideClick: false,
            didOpen: () => {
              customSwal.showLoading();
            },
          });
          this.userService.updateUser(updatedData).subscribe({
            next: () => {
              customSwal.close();
              customSwal.fire({
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
              customSwal.close();
              customSwal.fire({
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
    const customSwal = Swal.mixin({
      customClass:{
        popup: "title-swal",
      },
    });
    if (this.editedUser.invalid) {
      customSwal.fire({
        title: "กรุณากรอกข้อมูลให้ถูกต้อง",
        icon: "error",
      })
      return;
    }

    if (this.editedUser.get('email')?.value === this.user?.email) {
      customSwal.fire({
        title: "อีเมลนี้ซ้ำกับอีเมลที่คุณกำลังใช้งานอยู่",
        icon: "error",
      });
      return;
    }
    
    const updatedData = this.editedUser.value;
    customSwal.fire({
      title: "ต้องการบันทึกการเปลี่ยนแปลง?",
      text: "หากต้องการเข้าใช้งานอีกครั้ง กรุณาใช้งานอีเมลใหม่นี้",
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      icon: "warning",
    }).then((result) => {
      if (result.isConfirmed) {
        customSwal.fire({
          title: "กำลังบันทึกข้อมูล...",
          allowOutsideClick: false,
          didOpen: () => {
            customSwal.showLoading();
          },
        });
        this.userService.updateUser(updatedData).subscribe({
          next: () => {
            customSwal.close();
            customSwal.fire({
              icon: "success",
              title: "Success",
              text: "ทำการบันทึกข้อมูลเรียบร้อยแล้ว",
              showConfirmButton: true,
            });
            this.user = { ...this.user, ...updatedData }; // อัปเดตข้อมูลใน UI
            this.editUserUpdate()
            this.dataModal();
            this.authService.logout();
          },
          error: (error) => {
            customSwal.close();
            if (error.status === 409) {
              customSwal.fire({
                icon: "error",
                title: "อีเมลนี้มีผู้ใช้งานแล้ว",
                showConfirmButton: true,
              });
            } else {
              customSwal.fire({
                icon: "error",
                title: "Error",
                text: "บันทึกข้อมูลไม่สำเร็จ โปรดลองอีกครั้งในภายหลัง",
                showConfirmButton: true,
              });
            }
          }
        });
      }
    })
  }

  onPasswordSubmit(){
    const customSwal = Swal.mixin({
      customClass:{
        popup: "title-swal",
      },
    });
    if (this.passwordForm.invalid) {
      customSwal.fire({
        title: "กรุณากรอกข้อมูลให้ถูกต้อง",
        icon: "error",
      })
      return;
    }

    const { oldPassword, newPassword, repeatNewPassword } = this.passwordForm.value;

    if (newPassword !== repeatNewPassword) {
      customSwal.fire({
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
      customSwal.fire({
        title: "ต้องการบันทึกการเปลี่ยนแปลง?",
        showCancelButton: true,
        confirmButtonText: "บันทึก",
        cancelButtonText: "ยกเลิก",
        icon: "warning",
      }).then((result) => {
        if (result.isConfirmed) {
          customSwal.fire({
            title: "กำลังบันทึกข้อมูล...",
            allowOutsideClick: false,
            didOpen: () => {
              customSwal.showLoading();
            },
          });

          this.userService.updateUserPassword(passwordData).subscribe({
            next: () => {
              customSwal.close();
              customSwal.fire({
                icon: "success",
                title: "Success",
                text: "ทำการบันทึกข้อมูลเรียบร้อยแล้ว",
                showConfirmButton: true,
              });
              this.passwordForm.reset()
              this.passwordModal();
              this.authService.logout();
            },
            error: (error) => {
              customSwal.close();
              if (error.status === 403) {
                customSwal.fire({
                  icon: "error",
                  title: "รหัสผ่านไม่ถูกต้อง",
                  text: "กรุณาตรวจสอบรหัสผ่านเก่าของคุณ",
                  showConfirmButton: true,
                });
              } else {
                customSwal.fire({
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
      customSwal.fire({
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

  openPages(page: Number){
    this.userService.setStoragePage(page);
  }

  userLogin(){
    this.router.navigate(['/login']);
  }

  NavigateToAddress(){
    this.router.navigate(['/address']);
  }

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    };
  }

}
