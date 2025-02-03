import { Component } from '@angular/core';
import { DestBank } from '../../interfaces/bank/dest-bank';
import { OriginBank } from '../../interfaces/bank/origin-bank';
import { BankService } from '../../services/bank/bank.service';
import Swal from 'sweetalert2'; // นำเข้า SweetAlert2

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css'], // แก้ไขให้ตรงกับชื่อไฟล์
})
export class BankComponent {
  destBank!: DestBank[];
  originBank!: OriginBank[];
  isDestBank!: boolean;

  constructor(private bankService: BankService) {
    this.getBank();
  }

  getBank() {
    this.bankService.getDestBank().subscribe((res) => {
      this.destBank = res;
    });
    this.bankService.getOriginBank().subscribe((res) => {
      this.originBank = res;
    });
  }

  openDestBank() {
    this.isDestBank = true;
  }

  openOriginBank() {
    this.isDestBank = false;
  }

  deleteDestBank(id: number) {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการลบธนาคารปลายทางนี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบเลย!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bankService.deleteDestBank(id).subscribe(
          () => {
            // ลบธนาคารจากรายการในตารางโดยตรง (ถ้าไม่ต้องการรีเฟรชข้อมูลจาก getBank())
            this.destBank = this.destBank.filter((bank) => bank.id !== id);
            Swal.fire('ลบแล้ว!', 'ธนาคารปลายทางถูกลบแล้ว', 'success');
          },
          (error) => {
            // ถ้ามีข้อผิดพลาดในขณะลบ
            Swal.fire('ข้อผิดพลาด!', 'ไม่สามารถลบธนาคารปลายทางได้', 'error');
          }
        );
      }
    });
  }

  // ฟังก์ชันลบธนาคารต้นทางพร้อมยืนยันจาก SweetAlert
  deleteOriginBank(id: number) {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการลบธนาคารต้นทางนี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบเลย!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bankService.deleteOriginBank(id).subscribe(() => {
          this.getBank(); // รีเฟรชข้อมูลธนาคารต้นทางหลังจากลบ
          Swal.fire('ลบแล้ว!', 'ธนาคารต้นทางถูกลบแล้ว', 'success');
        });
      }
    });
  }
}
