import { Component, EventEmitter, Input, input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ShippingService } from '../../../services/shipping/shipping.service';
import { Shipping } from '../../../interfaces/shipping/shipping.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-update-shipping',
  templateUrl: './update-shipping.component.html',
  styleUrl: './update-shipping.component.css'
})
export class UpdateShippingComponent implements OnInit{

  form!: FormGroup;

  @Input()  shipping: Shipping = {} as Shipping;
  // @Output() reloadData = new EventEmitter<void>();

  constructor(private shippingService: ShippingService, private router: Router, private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      company: [this.shipping.company, [Validators.required]], // ฟอร์มสำหรับชื่อหมวดหมู่
      fees: [this.shipping.fees, [Validators.required]],
    });
  }

  updateShipping() {
    const customSwal = Swal.mixin({
      customClass:{
        popup: "title-swal",
        confirmButton: "text-swal",
        cancelButton: "text-swal",
      },
    });
    customSwal.fire({
      title: 'คุณต้องการบันทึหรือไม่?',
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      icon: 'warning',
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log(this.shipping.id, this.form.value)
        this.shippingService.updateShipping(this.shipping.id, this.form.value).subscribe(
          () => {
            customSwal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: 'ข้อมูลถูกบันทึกแล้ว!',
            })
            window.location.reload();
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
  
  goToShipping(): void {
    this.router.navigate(['/superadmin/shipping']);
  }
}
