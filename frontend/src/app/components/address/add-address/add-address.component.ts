import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AddressService } from '../../../services/address/address.service';
import { AddressModel } from '../../../interfaces/address/address.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.css']
})
export class AddAddressComponent implements OnInit {

  ThaiData: any[] = [];
  uniqueProvinces: string[] = [];
  filteredDistricts: string[] = [];
  filteredSubDistricts: string[] = [];

  selectedProvince?: string;
  selectedDistrict?: string;
  selectedSubDistrict?: string;

  addressForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private addressService: AddressService,
    private userService: UserService,
  ) {
    this.addressForm = this.fb.group({
      firstName: [
        '', 
        [Validators.required, Validators.pattern(/^[A-Za-zก-๙\s]+$/), this.noWhitespaceValidator()] // อนุญาตเฉพาะตัวอักษรไทย/อังกฤษและช่องว่าง
      ],
      lastName: [
        '', 
        [Validators.required, Validators.pattern(/^[A-Za-zก-๙\s]+$/), this.noWhitespaceValidator()] // อนุญาตเฉพาะตัวอักษรไทย/อังกฤษและช่องว่าง
      ],
      street: ['', [Validators.required]],
      province: ['', [Validators.required]],
      district: ['', [Validators.required]],
      subDistrict: ['', [Validators.required]],
      phoneNumber: [
        '', 
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)] // เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก
      ],
      postalCode: [
        '', 
        [Validators.required, Validators.pattern(/^[0-9]{5}$/)] // รหัสไปรษณีย์เป็นตัวเลข 5 หลัก
      ]
    });
  }

  ngOnInit(): void {
    this.addressService.fetchThaiData().subscribe((result: any[]) => {
      this.ThaiData = result;

      // สร้างรายการจังหวัด
      this.uniqueProvinces = [...new Set(this.ThaiData.map(item => item.name_th))].sort((a, b) => a.localeCompare(b, 'th-TH'));
    });
  }

  provinceSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const province = target.value;
    this.selectedProvince = province;
    this.selectedDistrict = undefined;
    this.selectedSubDistrict = undefined;

    // กรองอำเภอตามจังหวัด
    const selectedProvinceData = this.ThaiData.find(p => p.name_th === province);
    this.filteredDistricts = selectedProvinceData ? selectedProvinceData.amphure.map((a: any) => a.name_th).sort((a: any, b: any) => a.localeCompare(b, 'th-TH')): [];

    this.addressForm.patchValue({
      province: this.selectedProvince,
      district: '',
      subDistrict: ''
    });
  }

  districtSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const district = target.value;
    this.selectedDistrict = district;
    this.selectedSubDistrict = undefined;

    // กรองตำบลตามจังหวัดและอำเภอ
    const provinceData = this.ThaiData.find(p => p.name_th === this.selectedProvince);
    const selectedDistrictData = provinceData?.amphure.find((a: any) => a.name_th === district);
    this.filteredSubDistricts = selectedDistrictData ? selectedDistrictData.tambon.map((a: any) => a.name_th).sort((a: any, b: any) => a.localeCompare(b, 'th-TH')): [];

    this.addressForm.patchValue({
      district: this.selectedDistrict,
      subDistrict: ''
    });
  }

  subDistrictSelect(event: Event) {
    const subDistrict = typeof event === 'string' ? event : (event.target as HTMLSelectElement).value;
    this.selectedSubDistrict = subDistrict;
  
    // กำหนดรหัสไปรษณีย์อัตโนมัติ
    const provinceData = this.ThaiData.find(p => p.name_th === this.selectedProvince);
    const districtData = provinceData?.amphure.find((a: any) => a.name_th === this.selectedDistrict);
    const selectedSubDistrictData = districtData?.tambon.find((t: any) => t.name_th === subDistrict);
    const postalCode = selectedSubDistrictData?.zip_code || '';
  
    // อัปเดตค่ารหัสไปรษณีย์ในฟอร์ม
    this.addressForm.patchValue({
      subDistrict: this.selectedSubDistrict,
      postalCode: postalCode
    });
  }
  

  submit() {
    const firstNameControl = this.addressForm.get('firstName');
    const lastNameControl = this.addressForm.get('lastName');
    
    if (firstNameControl && typeof firstNameControl.value === 'string') {
      firstNameControl.setValue(firstNameControl.value.trim());
    }
    
    if (lastNameControl && typeof lastNameControl.value === 'string') {
      lastNameControl.setValue(lastNameControl.value.trim());
    }
  
    // Check if firstName or lastName is empty after trimming
    if (firstNameControl?.value === '' || lastNameControl?.value === '') {
      if (firstNameControl?.value === '') {
        firstNameControl.setErrors({ 'whitespace': true });
      }
      if (lastNameControl?.value === '') {
        lastNameControl.setErrors({ 'whitespace': true });
      }
    }
  
    if (this.addressForm.valid) {
      const newAddress = {
        id: 0,
        firstName: firstNameControl?.value,
        lastName: lastNameControl?.value,
        street: this.addressForm.get('street')?.value,
        province: this.addressForm.get('province')?.value,
        district: this.addressForm.get('district')?.value,
        subDistrict: this.addressForm.get('subDistrict')?.value,
        phoneNumber: this.addressForm.get('phoneNumber')?.value,
        postalCode: this.addressForm.get('postalCode')?.value,
      };
      const customSwal = Swal.mixin({
        customClass:{
          popup: "title-swal",
          confirmButton: "text-swal",
          cancelButton: "text-swal",
        },
      });
      customSwal.fire({
        title: "ต้องการเพิ่มข้อมูลหรือไม่",
        showCancelButton: true,
        confirmButtonText: "บันทึก",
        cancelButtonText: "ยกเลิก",
        icon: "warning",
      }).then((result) => {
        if (result.isConfirmed) {
          customSwal.fire({
            title: "กำลังบันทึกข้อมูล...",
            allowOutsideClick: false,
            didOpen: () => {
              customSwal.showLoading();
            },
          });
    
          this.addressService.createAddress(newAddress).subscribe({
            next: () => {
              customSwal.close();
              customSwal.fire({
                icon: "success",
                title: "บันทึกแล้ว",
                text: "เพิ่มข้อมูลที่อยู่เรียบร้อยแล้ว",
                showConfirmButton: true,
              });
              this.addressForm.reset();
              this.addressNavigate();
              
            },
            error: (error) => {
              customSwal.close();
              customSwal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "บันทึกข้อมูลไม่สำเร็จ โปรดลองอีกครั้งในภายหลัง",
                showConfirmButton: true,
              });
              console.error("API error:", error);
            }
          });
        }
      });
    } else {
      this.addressForm.markAllAsTouched();
    }
  }
  

  cancel() {
    this.addressForm.reset();
    this.userService.setStoragePage(4)
  }

  addressNavigate(){
    this.userService.setStoragePage(4)
  }

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    };
  }

}
