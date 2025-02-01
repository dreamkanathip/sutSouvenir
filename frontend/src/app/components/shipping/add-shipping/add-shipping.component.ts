import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { ShippingService } from '../../../services/shipping/shipping.service';

@Component({
  selector: 'app-add-shipping',
  templateUrl: './add-shipping.component.html',
  styleUrl: './add-shipping.component.css'
})
export class AddShippingComponent {

  @Output() reloadData = new EventEmitter<void>();

  shippingData = new FormGroup({
    company: new FormControl(''),
    fees: new FormControl('')
  })

  constructor(private shippingService: ShippingService) { }

  addShipping() {
    const customSwal = Swal.mixin({
      customClass:{
        popup: "title-swal",
      },
    });
    customSwal.fire({
      title: 'คุณต้องการบันทึหรือไม่?',
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      icon: 'warning',
    }).then((result) => {
      if (result.isConfirmed) {
        this.shippingService.createShipping(this.shippingData.value).subscribe(
          () => {
            customSwal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: 'ข้อมูลถูกบันทึกแล้ว!',
            }).then(() => {
              this.reloadData.emit()
            })
          },
          (error) => {
            console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
            customSwal.fire({
              icon: 'error',
              title: 'ข้อผิดพลาด',
              text: 'ไม่สามารถบันทึกข้อมูลได้!',
            });
          }
        );
      }
    });
  }
}
