import { Component, OnInit } from '@angular/core';
import { DestBank } from '../../interfaces/bank/dest-bank';
import { OriginBank } from '../../interfaces/bank/origin-bank';
import { BankService } from '../../services/bank/bank.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'; // นำเข้า SweetAlert2

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css'],
})
export class BankComponent implements OnInit {
  originBank!: OriginBank[];
  isDestBank!: boolean;
  updateForm!: FormGroup; // ฟอร์มสำหรับอัปเดตข้อมูลธนาคารปลายทาง
  selectedDestBank: DestBank = {} as DestBank; // สำหรับเก็บธนาคารที่เลือก
  destBank: DestBank[] = []; // เปลี่ยนเป็นชนิด DestBank[] แทน any[]
  filteredDestBanks: DestBank[] = []; // สำหรับเก็บข้อมูลที่กรองแล้ว
  editMode: boolean = false; // เพิ่มตัวแปร editMode

  constructor(private bankService: BankService, private fb: FormBuilder) {
    this.getBank();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  // ฟังก์ชันสำหรับสร้างฟอร์ม
  initializeForm() {
    this.updateForm = this.fb.group({
      bank: ['', [Validators.required]],
      name: ['', [Validators.required]],
      bankNumber: ['', [Validators.required]],
      branch: ['', [Validators.required]],
    });
  }

  getBank() {
    this.bankService.getDestBank().subscribe((res) => {
      this.destBank = res;
      this.filteredDestBanks = [...this.destBank]; // กำหนดค่าฐานให้กับ filteredDestBanks
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

  saveEditDestBank(): void {
    const customSwal = Swal.mixin({
      customClass: {
        popup: 'title-swal',
        confirmButton: 'text-swal',
      },
    });

    if (this.selectedDestBank && this.selectedDestBank.name.trim()) {
      // เรียกใช้งาน service เพื่ออัปเดตธนาคารปลายทาง
      this.bankService
        .updateDestBank(this.selectedDestBank.id, {
          bank: this.selectedDestBank.bank,
          bankNumber: this.selectedDestBank.bankNumber,
          name: this.selectedDestBank.name,
          branch: this.selectedDestBank.branch,
        })
        .subscribe({
          next: (response) => {
            // อัปเดตธนาคารปลายทางในรายการ
            const index = this.destBank.findIndex(
              (bank) => bank.id === this.selectedDestBank.id
            );
            if (index !== -1) {
              this.destBank[index] = response; // แทนที่ข้อมูลใน array ด้วยข้อมูลใหม่
              this.filterDestBanks(); // อัปเดตการกรอง
            }

            // รีเซ็ตสถานะการแก้ไข
            this.selectedDestBank = {} as DestBank; // รีเซ็ต selectedDestBank
            this.editMode = false;

            // แจ้งเตือนสำเร็จ
            customSwal.fire(
              'สำเร็จ',
              'ข้อมูลธนาคารปลายทางถูกอัปเดตเรียบร้อยแล้ว',
              'success'
            );
          },
          error: (err) => {
            console.error('เกิดข้อผิดพลาดในการอัปเดตธนาคารปลายทาง:', err);
            customSwal.fire(
              'เกิดข้อผิดพลาด',
              'ไม่สามารถอัปเดตข้อมูลธนาคารปลายทางได้',
              'error'
            );
          },
        });
    } else {
      // แจ้งเตือนหากชื่อธนาคารหรือข้อมูลที่จำเป็นว่างเปล่า
      customSwal.fire('กรุณากรอกข้อมูลธนาคารให้ครบถ้วน');
    }
  }

  // ฟังก์ชันสำหรับการลบธนาคารปลายทาง
  deleteDestBank(id: number) {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการลบธนาคารปลายทางนี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bankService.deleteDestBank(id).subscribe(
          () => {
            this.destBank = this.destBank.filter((bank) => bank.id !== id);
            Swal.fire('ลบแล้ว!', 'ธนาคารปลายทางถูกลบแล้ว', 'success');
          },
          (error) => {
            Swal.fire('ข้อผิดพลาด!', 'ไม่สามารถลบธนาคารปลายทางได้', 'error');
          }
        );
      }
    });
  }

  filterDestBanks(): void {
    // กรองรายการธนาคารปลายทาง
    this.filteredDestBanks = this.destBank.filter(
      (bank) =>
        bank.name.toUpperCase() === this.selectedDestBank.bank?.toUpperCase()
    );
  }

  // ฟังก์ชันสำหรับการลบธนาคารต้นทาง
  deleteOriginBank(id: number) {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการลบธนาคารต้นทางนี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bankService.deleteOriginBank(id).subscribe(() => {
          this.getBank();
          Swal.fire('ลบแล้ว!', 'ธนาคารต้นทางถูกลบแล้ว', 'success');
        });
      }
    });
  }
}
