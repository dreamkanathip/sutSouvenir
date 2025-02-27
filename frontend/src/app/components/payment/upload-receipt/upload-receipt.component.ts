import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import flatpickr from 'flatpickr';
import { Inject, PLATFORM_ID } from '@angular/core';
import { BankService } from '../../../services/bank/bank.service';
import { DestBank } from '../../../interfaces/bank/dest-bank';
import { OriginBank } from '../../../interfaces/bank/origin-bank';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
export class UploadReceiptComponent implements AfterViewInit, OnInit {
  @ViewChild('datePicker') datePicker!: ElementRef
  @Input() sumItemPrice!: number
  @Input() orderSum!: number
  @Input() address!: AddressModel;
  @Input() shipping!: Shipping

  hrArray: string[] = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  minArray: string[] = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  date!: string;
  hr!: string;
  min!: string;
  destBank!: DestBank[];
  originBank!: OriginBank[];
  selectedFile!: File;

  paymentForm = new FormGroup({
    total: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]*$')]),
    originBankId: new FormControl('', [Validators.required]),
    destBankId: new FormControl('', [Validators.required]),
    lastFourDigits: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{4}$')]),
    transferAt: new FormControl('', [Validators.required]),
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

  get total() {
    return this.paymentForm.get('total');
  }
  get lastFourDigits() {
    return this.paymentForm.get('lastFourDigits');
  }
  get transferAt() {
    return this.paymentForm.get('transferAt');
  }
  get receipt() {
    return this.paymentForm.get('receipt');
  }
  get originBankId() {
    return this.paymentForm.get('originBankId');
  }
  get destBankId() {
    return this.paymentForm.get('destBankId');
  }

  ngOnInit(): void {
    this.paymentForm.patchValue({total: this.orderSum.toString()})
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

  stringToDateTime() {
    const datetimeString = `${this.date} ${this.hr?.padStart(2, '0')}:${this.min?.padStart(2, '0')}:00`;
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

    const customSwal = Swal.mixin({
      customClass: {
        popup: "title-swal",
        confirmButton: "text-swal",
        cancelButton: "text-swal",
      },
    });
    formData.append('total', this.orderSum.toString());
    formData.append('orderId', this.orderService.getOrderId().toString());
    formData.append('originBankId', this.paymentForm.get('originBankId')?.value ?? '');
    formData.append('destBankId', this.paymentForm.get('destBankId')?.value ?? '');
    formData.append('lastFourDigits', this.paymentForm.get('lastFourDigits')?.value ?? '');
    formData.append('transferAt', this.paymentForm.get('transferAt')?.value ?? '');
    formData.append('addressId', this.address?.id?.toString());
    formData.append('shippingId', this.shipping.id.toString());
    formData.append('cartTotal', this.orderSum.toString());

    if (this.selectedFile) {
      formData.append('receipt', this.selectedFile, this.selectedFile.name);
    }
    if (this.paymentForm.valid) {
      customSwal.fire({
        title: 'คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่?',
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        icon: 'warning',
      }).then((result) => {
        if (result.isConfirmed) {
          customSwal.fire({
            title: "กำลังดำเนินการ...",
            allowOutsideClick: false,
            didOpen: () => {
              customSwal.showLoading();
            },
          });
          this.paymentService.uploadPayment(formData).subscribe(
            () => {
              customSwal.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: 'อัพโหลดสลิปแล้ว!',
              }).then(() => {
                window.location.reload();
                this.userService.setStoragePage(1);
                this.router.navigate(["/user"])
              });
            },
            (error) => {
              console.error('เกิดข้อผิดพลาดในการอัพโหลดสลิป:', error);
              customSwal.fire({
                icon: 'error',
                title: 'ข้อผิดพลาด',
                text: 'ไม่สามารถอัพโหลดสลิปได้!',
              });
            }
          );
        }
      });
    } else {
      customSwal.fire({
        icon: 'error',
        title: 'ข้อผิดพลาด',
        text: 'ข้อมูลไม่ครบ',
      });
    }
  }
}
