import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from '../../services/address/address.service';
import { AddressModel } from '../../interfaces/address/address.model';
import Swal from 'sweetalert2';
import { error } from 'node:console';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit{

  allAddress?: AddressModel[]
  updateMessage?: String
  defaultAddress?: number

  constructor(private router: Router, private addressService: AddressService) {
    this.getAllAddress()
  }

  ngOnInit(): void {
    
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
              icon: "success",
              title: "Success",
              text: "ลบข้อมูลที่อยู่เรียบร้อยแล้ว",
              showConfirmButton: true,
            });
            this.getAllAddress();
          },
          error: (error) => {
            Swal.close();
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "ลบข้อมูลไม่สำเร็จ โปรดลองอีกครั้งในภายหลัง",
              showConfirmButton: true,
            });
            console.error("API error:", error);
          }
        });
      }
    })
  }

  setDefaultAddress(id: number){
    let errorCheck: boolean = true
    // ปรับ Default Address เก่าออก
    if (this.defaultAddress) {
      this.addressService.setDefaultAddress(this.defaultAddress, false).subscribe({
        error: (error) => {
          errorCheck = false
          console.error("Error Occured:", error)
        }
      })
    }
    // set Default Address อันใหม่
    if (errorCheck) {
      this.addressService.setDefaultAddress(id, true).subscribe({
        next: () => {
          this.getAllAddress()
        }
      })
    }
  }

}
