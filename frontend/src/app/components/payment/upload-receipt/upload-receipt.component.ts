import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import flatpickr from 'flatpickr';
import { Inject, PLATFORM_ID } from '@angular/core';
import { BankService } from '../../../services/bank/bank.service';
import { DestBank } from '../../../interfaces/bank/dest-bank';
import { OriginBank } from '../../../interfaces/bank/origin-bank';
import { FormControl, FormGroup } from '@angular/forms';
import { PaymentService } from '../../../services/order/payment.service';
import Swal from 'sweetalert2';
import { AddressService } from '../../../services/address/address.service';
import { OrderService } from '../../../services/order/order.service';
import { AddressModel } from '../../../interfaces/address/address.model';
import { Shipping } from '../../../interfaces/shipping/shipping.model';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-upload-receipt',
  templateUrl: './upload-receipt.component.html',
  styleUrls: ['./upload-receipt.component.css'],
})
export class UploadReceiptComponent implements AfterViewInit {

  @Input() sumItemPrice!: number
  @Input() orderSum!: number
  @Input() address!: AddressModel;
  @Input() shipping!: Shipping

  hrArray: string[] = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  minArray: string[] = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  
  date!: string;
  hr: string = '00';
  min: string = '00';
  destBank!: DestBank[];
  originBank!: OriginBank[];
  selectedFile!: File;

  paymentForm = new FormGroup({
    total: new FormControl(''),
    orderId: new FormControl(''),
    originBankId: new FormControl(''),
    destBankId: new FormControl(''),
    lastFourDigits: new FormControl(''),
    transferAt: new FormControl(''),
    receipt: new FormControl('')
  })
  
  constructor(
    @Inject(PLATFORM_ID) 
    private platformId: Object, 
    private bankService: BankService,
    private paymentService: PaymentService,
    private orderService: OrderService,
    private userService: UserService,
    private router: Router,   
  ) {
    this.getBank()
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      flatpickr('#date', {
        dateFormat: 'Y-n-j',
        altInput: true,
        altFormat: "j-n-Y",
        onChange: (selectedDates, dateStr) => {
          this.date = dateStr;
        },
      });
    }
  }
  
  stringToDateTime(){
    const datetimeString = `${this.date} ${this.hr.padStart(2, '0')}:${this.min.padStart(2, '0')}:00`;
    const datetime = new Date(datetimeString);
    this.paymentForm.get("transferAt")?.setValue(datetimeString)
  }

  onImageAdd(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  
  show() {
    this.stringToDateTime()
  }
  getBank() {
    this.bankService.getDestBank().subscribe(res => {
      this.destBank = res
    })
    this.bankService.getOriginBank().subscribe(res => {
      this.originBank = res
    })
  }

  upload() {
    const datetimeString = `${this.date} ${this.hr.padStart(2, '0')}:${this.min.padStart(2, '0')}:00`;
    this.paymentForm.get("transferAt")?.setValue(datetimeString)

    const formData = new FormData();

    formData.append('total', this.orderSum.toString());  
    formData.append('orderId', this.orderService.getOrderId().toString());
    formData.append('originBankId', this.paymentForm.get('originBankId')?.value?? '');
    formData.append('destBankId', this.paymentForm.get('destBankId')?.value?? '');
    formData.append('lastFourDigits', this.paymentForm.get('lastFourDigits')?.value?? '');
    formData.append('transferAt', this.paymentForm.get('transferAt')?.value?? '');
    formData.append('addressId', this.address?.id?.toString());
    formData.append('shippingId', this.shipping.id.toString());
    formData.append('cartTotal', this.orderSum.toString());
    if (this.selectedFile) {
      formData.append('receipt', this.selectedFile, this.selectedFile.name);
    }

    Swal.fire({
          title: 'คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่?',
          showCancelButton: true,
          confirmButtonText: 'บันทึก',
          icon: 'warning',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "กำลังดำเนินการ...",
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });
            this.paymentService.uploadPayment(formData).subscribe(
              () => {
                Swal.fire({
                  icon: 'success',
                  title: 'สำเร็จ',
                  text: 'อัพโหลดสลิปแล้ว!',
                }).then(() => {
                  this.userService.setStoragePage(1);
                  this.router.navigate(["/user"])
                });
              },
              (error) => {
                console.error('เกิดข้อผิดพลาดในการอัพโหลดสลิป:', error);
                Swal.fire({
                  icon: 'error',
                  title: 'ข้อผิดพลาด',
                  text: 'ไม่สามารถอัพโหลดสลิปได้!',
                });
              }
            );
          }
        });
  }
}
