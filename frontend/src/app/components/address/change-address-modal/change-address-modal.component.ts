import { Component, EventEmitter, Output } from '@angular/core';
import { AddressService } from '../../../services/address/address.service';
import { AddressModel } from '../../../interfaces/address/address.model';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-change-address-modal',
  templateUrl: './change-address-modal.component.html',
  styleUrls: ['./change-address-modal.component.css']
})
export class ChangeAddressModalComponent {

  @Output() changeDefaultAddress = new EventEmitter<void>();

  allAddress!: AddressModel[]
  updateMessage!: string;

  constructor(private addressService: AddressService,private userService: UserService ,private router: Router) {
    this.getAllAddress()
  }

  getAllAddress() {
    this.addressService.getAllAddress().subscribe((res) => {
      this.allAddress = res
    })
  }

  toDefaultAddress(item: any) {
    const defaultAddress = this.allAddress?.find((d) => d.default)
    if (defaultAddress)
      this.addressService.setDefaultAddress(defaultAddress.id, false).pipe(
        switchMap(() => {
          return this.addressService.setDefaultAddress(item.id, true);
        })
      ).subscribe({
        next: () => {
          this.getAllAddress();
          this.changeDefaultAddress.emit()
        },
        error: (error) => {
          console.error('Error updating default address:', error);
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'เกิดข้อผิดพลาดในการอัปเดตที่อยู่เริ่มต้น โปรดลองใหม่อีกครั้ง',
            showConfirmButton: true,
          });
        },
      });
  }
  // addNavigate() {
  //   this.router.navigate(['/address/add']);
  // }
  NavigateToStorage(page: number){
    this.userService.setStoragePage(page)
    this.router.navigate(['/user/storage']);
  }
}

