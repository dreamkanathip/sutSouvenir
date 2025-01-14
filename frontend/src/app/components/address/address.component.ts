import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from '../../services/address/address.service';
import { AddressModel } from '../../interfaces/address/address.model';
import Swal from 'sweetalert2';
import { UserModel } from '../../interfaces/user/user.model';
import { UserService } from '../../services/user/user.service';

declare const bootstrap: any;



@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit{

  user?: UserModel

  allAddress?: AddressModel[]
  updateMessage?: String
  defaultAddress?: number

  @ViewChild('toast', { static: true }) toastElement!: ElementRef;

  constructor(private router: Router, private userService: UserService, private addressService: AddressService) {
    
  }

  ngOnInit(): void {
    this.getUserData()
    this.getAllAddress()
  }

  getUserData() {
    this.userService.getUserData().subscribe({
      next: (result: UserModel) => {
        if (result) {
          this.user = result;
        }
      },
      error: (err) => {
        console.error('Error fetching user data', err);
      }
    });
  }

  getAllAddress(){
    this.addressService.getAllAddress(1).subscribe((result: any) => {
      this.allAddress = result
      result.forEach((address: any) => {
        if (address.default) {
          this.defaultAddress = address.id
        }
      });
    })
  }

  addNavigate() {
    this.router.navigate(['/address/add']);
  }

  editAddressNavigate(id: number) {
    this.addressService.selectedEditAddress(id)
    this.router.navigate(['/address/edit']);
  }

  deleteAddress(id: number){
    Swal.fire({
      title: "ต้องการลบข้อมูลที่อยู่หรือไม่?",
      showCancelButton: true,
      confirmButtonText: "ลบข้อมูล",
      cancelButtonText: "ยกเลิก",
      icon: "warning",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "กำลังลบข้อมูล...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
  
        this.addressService.deleteAddress(id).subscribe({
          next: () => {
            Swal.close();
            Swal.fire({
              icon: "error",
              title: "ลบข้อมูลแล้ว",
              text: "ลบข้อมูลที่อยู่เรียบร้อยแล้ว",
              showConfirmButton: true,
            });
            this.getAllAddress();
          },
          error: (error) => {
            Swal.close();
            Swal.fire({
              icon: "warning",
              title: "เกิดข้อผิดพลาด",
              text: "ลบข้อมูลไม่สำเร็จ กรุณาลองอีกครั้งในภายหลัง",
              showConfirmButton: true,
            });
            console.error("API error:", error);
          }
        });
      }
    })
  }

  setDefaultAddress(id: number){
    // ปรับ Default Address เก่าออก
    if (this.defaultAddress) {
      this.addressService.setDefaultAddress(this.defaultAddress, false).subscribe({
        next: () => {
          this.setNewAddress(id)
        },
        error: (error) => {
          console.error("Error Occured:", error)
          Swal.fire({
            icon: "warning",
            title: "เกิดข้อผิดพลาด",
            text: "บันทึกข้อมูลไม่สำเร็จ โปรดลองอีกครั้งในภายหลัง",
            showConfirmButton: true,
          });
        }
      })
    } else {
      this.setNewAddress(id); // หากไม่มีที่อยู่เดิม ให้ตั้งค่าที่อยู่ใหม่โดยตรง
    }
  }

  setNewAddress(id: number) {
    // set Default Address อันใหม่
    const status = true
    this.addressService.setDefaultAddress(id, true).subscribe({
      next: () => {
        this.getAllAddress()
        this.updateMessage = 'ที่อยู่เริ่มต้นถูกอัปเดตเรียบร้อย!';
        this.showToast();
      },
      error: () => {
        this.updateMessage = 'เกิดข้อผิดพลาดในการอัปเดตที่อยู่เริ่มต้น โปรดลองใหม่อีกครั้ง';
        this.showToast();
      }
    });
  }

  showToast() {
    const toast = new bootstrap.Toast(this.toastElement.nativeElement, {
      delay: 3000 // แสดงผล 3 วินาที
    });
    toast.show();
  }

}
