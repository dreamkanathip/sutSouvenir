import { Component, Output, EventEmitter, Input } from '@angular/core';
import { BankService } from '../../../services/bank/bank.service';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {

  @Output() reloadBankData = new EventEmitter<void>();
  @Input() destBank: boolean = true

  destBankData = new FormGroup({
    bank: new FormControl(''),
    bankNumber: new FormControl(''),
    name: new FormControl(''),
    branch: new FormControl(''),
  })

  originBankData = new FormGroup({
    bank: new FormControl('')
  })  

  constructor(private bankService: BankService){}

  addBank() {

    if(this.destBank) {
      Swal.fire({
        title: 'คุณต้องการบันทึหรือไม่?',
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        icon: 'warning',
      }).then((result) => {
        if (result.isConfirmed) {
          this.bankService.addDestBank(this.destBankData.value).subscribe(
            () => {
              Swal.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: 'ข้อมูลถูกบันทึกแล้ว!',
              }).then(() => {
                this.reloadBankData.emit()
              })
            },
            (error) => {
              console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
              Swal.fire({
                icon: 'error',
                title: 'ข้อผิดพลาด',
                text: 'ไม่สามารถบันทึกข้อมูลได้!',
              });
            }
          );
        }
      });
    } else {
      Swal.fire({
        title: 'คุณต้องการบันทึหรือไม่?',
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        icon: 'warning',
      }).then((result) => {
        if (result.isConfirmed) {
          this.bankService.addOriginBank(this.originBankData.value).subscribe(
            () => {
              Swal.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: 'ข้อมูลถูกบันทึกแล้ว!',
              }).then(() => {
                this.reloadBankData.emit()
              })
            },
            (error) => {
              console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
              Swal.fire({
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
}
