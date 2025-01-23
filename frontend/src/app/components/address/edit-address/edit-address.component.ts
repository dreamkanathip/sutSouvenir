import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AddressService } from '../../../services/address/address.service';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.css']
})
export class EditAddressComponent implements OnInit {

  ThaiData: any[] = [];
  uniqueProvinces: string[] = [];
  filteredDistricts: string[] = [];
  filteredSubDistricts: string[] = [];

  selectedProvince?: string;
  selectedDistrict?: string;
  selectedSubDistrict?: string;

  editAddressForm: FormGroup;

  addressId: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private addressService: AddressService,
  ) {
    this.editAddressForm = this.fb.group({
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

      // Fetch address data and populate the form
      this.getAddressData();
    });
  }

  getAddressData() {
    this.route.params.subscribe(params => {
      this.addressId = +params['id'];
      this.addressService.getAddress().subscribe((result: any) => {
        this.editAddressForm.patchValue(result);
        this.provinceSelect(result.province);
        this.districtSelect(result.district);
        this.subDistrictSelect(result.subDistrict);
      });
    });
  }

  provinceSelect(event: Event | string) {
    const province = typeof event === 'string' ? event : (event.target as HTMLSelectElement).value;
    this.selectedProvince = province;
    this.selectedDistrict = undefined;
    this.selectedSubDistrict = undefined;

    // กรองอำเภอตามจังหวัด
    const selectedProvinceData = this.ThaiData.find(p => p.name_th === province);
    this.filteredDistricts = selectedProvinceData ? selectedProvinceData.amphure.map((a: any) => a.name_th).sort((a: any, b: any) => a.localeCompare(b, 'th-TH')): [];

    this.editAddressForm.patchValue({
      province: this.selectedProvince,
      district: '',
      subDistrict: ''
    });
  }

  districtSelect(event: Event | string) {
    const district = typeof event === 'string' ? event : (event.target as HTMLSelectElement).value;
    this.selectedDistrict = district;
    this.selectedSubDistrict = undefined;

    // กรองตำบลตามจังหวัดและอำเภอ
    const provinceData = this.ThaiData.find(p => p.name_th === this.selectedProvince);
    const selectedDistrictData = provinceData?.amphure.find((a: any) => a.name_th === district);
    this.filteredSubDistricts = selectedDistrictData ? selectedDistrictData.tambon.map((a: any) => a.name_th).sort((a: any, b: any) => a.localeCompare(b, 'th-TH')): [];

    this.editAddressForm.patchValue({
      district: this.selectedDistrict,
      subDistrict: ''
    });
  }

  subDistrictSelect(subDistrict: string) {
    this.selectedSubDistrict = subDistrict;
  
    // กำหนดรหัสไปรษณีย์อัตโนมัติ
    const provinceData = this.ThaiData.find(p => p.name_th === this.selectedProvince);
    const districtData = provinceData?.amphure.find((a: any) => a.name_th === this.selectedDistrict);
    const selectedSubDistrictData = districtData?.tambon.find((t: any) => t.name_th === subDistrict);
    const postalCode = selectedSubDistrictData?.zip_code || '';
  
    // อัปเดตค่ารหัสไปรษณีย์ในฟอร์ม
    this.editAddressForm.patchValue({
      subDistrict: this.selectedSubDistrict,
      postalCode: postalCode
    });
  }

  submit() {
    const firstNameControl = this.editAddressForm.get('firstName');
    const lastNameControl = this.editAddressForm.get('lastName');
    
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
  
    if (this.editAddressForm.valid) {
      const updatedAddress = {
        id: this.addressId,
        firstName: firstNameControl?.value,
        lastName: lastNameControl?.value,
        street: this.editAddressForm.get('street')?.value,
        province: this.editAddressForm.get('province')?.value,
        district: this.editAddressForm.get('district')?.value,
        subDistrict: this.editAddressForm.get('subDistrict')?.value,
        phoneNumber: this.editAddressForm.get('phoneNumber')?.value,
        postalCode: this.editAddressForm.get('postalCode')?.value,
      };
      Swal.fire({
        title: "ต้องการแก้ไขข้อมูลหรือไม่",
        showCancelButton: true,
        confirmButtonText: "บันทึก",
        cancelButtonText: "ยกเลิก",
        icon: "warning",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "กำลังบันทึกข้อมูล...",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
    
          this.addressService.updateAddress(updatedAddress, this.addressId).subscribe({
            next: () => {
              Swal.close();
              Swal.fire({
                icon: "success",
                title: "บันทึกแล้ว",
                text: "แก้ไขข้อมูลที่อยู่เรียบร้อยแล้ว",
                showConfirmButton: true,
              });
              this.editAddressForm.reset();
              this.addressNavigate();
              
            },
            error: (error) => {
              Swal.close();
              Swal.fire({
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
      this.editAddressForm.markAllAsTouched();
    }
  }

  cancel() {
    this.editAddressForm.reset();
    this.router.navigate(['/address']);
  }

  addressNavigate(){
    this.router.navigate(['/address']);
  }

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    };
  }
}
