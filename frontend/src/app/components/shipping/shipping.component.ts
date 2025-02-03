import { Component } from '@angular/core';
import { ShippingService } from '../../services/shipping/shipping.service';
import { Shipping } from '../../interfaces/shipping/shipping.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrl: './shipping.component.css',
})
export class ShippingComponent {
  shippings: Shipping[] = [];
  edit: Shipping = {} as Shipping;

  constructor(private shippingService: ShippingService) {
    this.getCompany();
  }

  getCompany() {
    this.shippingService.getAllShippings().subscribe((res) => {
      console.log(res)
      this.shippings = res;
    });
  }

  deleteShipping(id: number) {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการลบข้อมูลการจัดส่งนี้ใช่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this.shippingService.deleteShipping(id).subscribe(() => {
          Swal.fire(
            'ลบสำเร็จ!',
            'ข้อมูลการจัดส่งถูกลบเรียบร้อยแล้ว',
            'success'
          );
          this.getCompany();
        });
      }
    });
  }

  editShipping(shipping: Shipping){
    this.edit = shipping
  }

  closeEditForm() {
    // this.toUpdate = undefined!;
    window.location.reload();
  }
}
