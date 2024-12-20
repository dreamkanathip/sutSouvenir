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

@Component({
  selector: 'app-upload-receipt',
  templateUrl: './upload-receipt.component.html',
  styleUrls: ['./upload-receipt.component.css'],
})
export class UploadReceiptComponent implements AfterViewInit {

  @Input() sumItemPrice!: number
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
    userId: new FormControl(''),
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
    private paymentService: PaymentService
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
    console.log("add image")
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

    this.paymentForm.get("userId")?.setValue('1')
    this.paymentForm.get("orderId")?.setValue('1')

    const datetimeString = `${this.date} ${this.hr.padStart(2, '0')}:${this.min.padStart(2, '0')}:00`;
    this.paymentForm.get("transferAt")?.setValue(datetimeString)

    const formData = new FormData();

    formData.append('total', this.paymentForm.get('total')?.value?? '');
    formData.append('orderId', this.paymentForm.get('orderId')?.value?? '');
    formData.append('userId', this.paymentForm.get('userId')?.value?? '');
    formData.append('originBankId', this.paymentForm.get('originBankId')?.value?? '');
    formData.append('destBankId', this.paymentForm.get('destBankId')?.value?? '');
    formData.append('lastFourDigits', this.paymentForm.get('lastFourDigits')?.value?? '');
    formData.append('transferAt', this.paymentForm.get('transferAt')?.value?? '');
    if (this.selectedFile) {
      formData.append('receipt', this.selectedFile, this.selectedFile.name);
    }

    console.log(this.paymentForm.value)

    Swal.fire({
          title: 'คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่?',
          showCancelButton: true,
          confirmButtonText: 'บันทึก',
          icon: 'warning',
        }).then((result) => {
          if (result.isConfirmed) {
            this.paymentService.uploadPayment(formData).subscribe(
              () => {
                Swal.fire({
                  icon: 'success',
                  title: 'สำเร็จ',
                  text: 'อัพโหลดสลิปแล้ว!',
                }).then(() => {
                  
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
