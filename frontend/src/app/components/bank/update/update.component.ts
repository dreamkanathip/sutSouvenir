import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankService } from '../../../services/bank/bank.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DestBank } from '../../../interfaces/bank/dest-bank';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent {
  form!: FormGroup;

  @Input() bank: DestBank = {} as DestBank;

  constructor(
    private fb: FormBuilder,
    private bankService: BankService, // ใช้ BankService
    private router: Router
  ) {}

  ngOnInit(): void {
    // สร้างฟอร์ม
    this.form = this.fb.group({
      id: this.bank.id, // เพิ่ม id ของธนาคารที่ต้องการอัปเดต
      bank: [this.bank.bank, [Validators.required]],
      name: [this.bank.name, [Validators.required]], // ฟอร์มสำหรับชื่อธนาคาร
      branch: [this.bank.branch, [Validators.required]], // ฟอร์มสำหรับสาขาธนาคาร
      bankNumber: [this.bank.bankNumber, [Validators.required]], // ฟอร์มสำหรับหมายเลขธนาคาร
    });
  }

  // ฟังก์ชันสำหรับบันทึกการเปลี่ยนแปลง
  submit(): void {
    if (this.form.invalid) {
      console.log('ฟอร์มไม่ถูกต้อง');
      return;
    }

    const formData = {
      id: this.bank.id, // เพิ่ม id ของธนาคารที่ต้องการอัปเดต
      bank: this.form.value.bank,
      name: this.form.value.name, // ชื่อธนาคาร
      branch: this.form.value.branch, // สาขาธนาคาร
      bankNumber: this.form.value.bankNumber, // หมายเลขธนาคาร
    };

    // ตั้งค่า Swal
    const customSwal = Swal.mixin({
      customClass: {
        popup: 'title-swal',
        confirmButton: 'text-swal',
        cancelButton: 'text-swal',
      },
    });

    customSwal
      .fire({
        title: 'คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่?',
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        icon: 'warning',
      })
      .then((result) => {
        if (result.isConfirmed) {
          // เรียกใช้ BankService เพื่ออัปเดตธนาคารปลายทาง
          this.bankService.updateDestBank(this.bank.id, formData).subscribe(
            () => {
              customSwal
                .fire({
                  icon: 'success',
                  title: 'สำเร็จ',
                  text: 'ข้อมูลธนาคารถูกบันทึกแล้ว!',
                })
                .then(() => {
                  // รีเซ็ตฟอร์มหลังจากบันทึกสำเร็จ
                  this.form.reset({
                    name: '',
                    branch: '',
                    bankNumber: '',
                  });

                  // รีเฟรชหน้า
                  window.location.reload(); // เพิ่มการรีเฟรชหน้า
                });
            },
            (error) => {
              console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูลธนาคาร:', error);
              customSwal.fire({
                icon: 'error',
                title: 'ข้อผิดพลาด',
                text: 'ไม่สามารถบันทึกข้อมูลธนาคารได้!',
              });
            }
          );
        }
      });
  }

  // ฟังก์ชันสำหรับการย้อนกลับไปหน้าธนาคาร
  goToBanks(): void {
    // นำทางไปยังหน้าธนาคาร
    this.router.navigate(['/superadmin/bank']);
  }
}
