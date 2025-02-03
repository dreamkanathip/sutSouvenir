import { Component, Output, EventEmitter, Input } from '@angular/core';
import { BankService } from '../../../services/bank/bank.service';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrl: './add.component.css',
})
export class AddComponent {
  @Output() reloadBankData = new EventEmitter<void>();
  @Input() destBank: boolean = true;

  destBankData = new FormGroup({
    bank: new FormControl(''),
    bankNumber: new FormControl(''),
    name: new FormControl(''),
    branch: new FormControl(''),
  });

  originBankData = new FormGroup({
    bank: new FormControl(''),
  });

  constructor(private bankService: BankService) {}

  addBank() {
    const customSwal = Swal.mixin({
      customClass: {
        popup: 'title-swal',
        confirmButton: 'text-swal',
        cancelButton: 'text-swal',
      },
    });

    customSwal
      .fire({
        title: 'คุณต้องการบันทึกหรือไม่?',
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        cancelButtonText: 'ยกเลิก', // เปลี่ยนจาก 'Cancel' เป็น 'ยกเลิก'
        icon: 'warning',
      })
      .then((result) => {
        if (result.isConfirmed) {
          const bankData = this.destBank
            ? this.destBankData.value
            : this.originBankData.value;
          const addBankMethod = this.destBank
            ? this.bankService.addDestBank
            : this.bankService.addOriginBank;

          addBankMethod.call(this.bankService, bankData).subscribe(
            () => {
              customSwal
                .fire({
                  icon: 'success',
                  title: 'สำเร็จ',
                  text: 'ข้อมูลถูกบันทึกแล้ว!',
                })
                .then(() => {
                  this.reloadBankData.emit();
                  window.location.reload(); // รีเฟรชหน้าเพจหลังจากบันทึกสำเร็จ
                });
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
