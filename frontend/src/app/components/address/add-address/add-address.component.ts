import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AddressService } from '../../../services/address/address.service';
import { AddressModel } from '../../../interfaces/address/address.model';

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

  constructor(private fb: FormBuilder, private router: Router, private addressService: AddressService) {
    this.addressForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      street: ['', [Validators.required]],
      province: ['', [Validators.required]],
      district: ['', [Validators.required]],
      subDistrict: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      postalCode: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.addressService.fetchThaiData().subscribe((result: any[]) => {
      this.ThaiData = result;

      // สร้างรายการจังหวัด
      this.uniqueProvinces = [...new Set(this.ThaiData.map(item => item.name_th))];
    });
  }

  provinceSelect(province: string) {
    this.selectedProvince = province;
    this.selectedDistrict = undefined;
    this.selectedSubDistrict = undefined;

    // กรองอำเภอตามจังหวัด
    const selectedProvinceData = this.ThaiData.find(p => p.name_th === province);
    this.filteredDistricts = selectedProvinceData ? selectedProvinceData.amphure.map((a: any) => a.name_th) : [];

    this.addressForm.patchValue({
      province: this.selectedProvince,
      district: '',
      subDistrict: ''
    });
  }

  districtSelect(district: string) {
    this.selectedDistrict = district;
    this.selectedSubDistrict = undefined;

    // กรองตำบลตามจังหวัดและอำเภอ
    const provinceData = this.ThaiData.find(p => p.name_th === this.selectedProvince);
    const selectedDistrictData = provinceData?.amphure.find((a: any) => a.name_th === district);
    this.filteredSubDistricts = selectedDistrictData ? selectedDistrictData.tambon.map((t: any) => t.name_th) : [];

    this.addressForm.patchValue({
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
    this.addressForm.patchValue({
      subDistrict: this.selectedSubDistrict,
      postalCode: postalCode
    });
  }
  

  submit() {
    if (this.addressForm.valid) {
      const newAddress: AddressModel = {
        id: 0,
        firstName: this.addressForm.get('firstName')?.value,
        lastName: this.addressForm.get('lastName')?.value,
        street: this.addressForm.get('street')?.value,
        province: this.addressForm.get('province')?.value,
        district: this.addressForm.get('district')?.value,
        subDistrict: this.addressForm.get('subDistrict')?.value,
        phoneNumber: this.addressForm.get('phoneNumber')?.value,
        postalCode: this.addressForm.get('postalCode')?.value,
        userID: 1,
      };

      Swal.fire({
        title: "ต้องการเพิ่มข้อมูลหรือไม่",
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
    
          this.addressService.createAddress(newAddress, 1).subscribe({
            next: () => {
              Swal.close();
              Swal.fire({
                icon: "success",
                title: "Success",
                text: "เพิ่มข้อมูลที่อยู่เรียบร้อยแล้ว",
                showConfirmButton: true,
              });
              this.addressForm.reset();
              this.addressNavigate();
            },
            error: (error) => {
              Swal.close();
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "บันทึกข้อมูลไม่สำเร็จ โปรดลองอีกครั้งในภายหลัง",
                showConfirmButton: true,
              });
              console.error("API error:", error);
            }
          });
        }
      })
    } else {
      console.log("Form is invalid", this.addressForm.value);
    }
  }

  cancel() {
    this.addressForm.reset();
    this.router.navigate(['/address']);
  }

  addressNavigate(){
    this.router.navigate(['/address']);
  }
}
