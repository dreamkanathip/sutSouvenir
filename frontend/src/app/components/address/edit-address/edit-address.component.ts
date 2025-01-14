import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddressService } from '../../../services/address/address.service';
import { AddressModel } from '../../../interfaces/address/address.model';
import Swal from 'sweetalert2';

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
    private addressService: AddressService,
  ) {
    this.editAddressForm = this.fb.group({
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

      // ดึงข้อมูลจังหวัด
      this.uniqueProvinces = [
        ...new Set(this.ThaiData.map(item => item.name_th))
      ];
    });

    this.getAddressData();
  }

  getAddressData() {
    this.addressService.getAddress(this.addressService.getEditAddressId()).subscribe((result: AddressModel) => {
      this.editAddressForm.patchValue({
        firstName: result.firstName,
        lastName: result.lastName,
        street: result.street,
        province: result.province,
        district: result.district,
        subDistrict: result.subDistrict,
        phoneNumber: result.phoneNumber,
      });

      this.addressId = result.id

      this.provinceSelect(result.province);
      this.districtSelect(result.district);
      this.subDistrictSelect(result.subDistrict);
    });
  }

  provinceSelect(province: string) {
    this.selectedProvince = province;
    this.selectedDistrict = undefined;
    this.selectedSubDistrict = undefined;

    const selectedProvinceData = this.ThaiData.find(p => p.name_th === province);
    this.filteredDistricts = selectedProvinceData ? selectedProvinceData.amphure.map((a: any) => a.name_th) : [];

    this.editAddressForm.patchValue({
      province: this.selectedProvince,
      district: '',
      subDistrict: ''
    });
  }

  districtSelect(district: string) {
    this.selectedDistrict = district;
    this.selectedSubDistrict = undefined;

    const provinceData = this.ThaiData.find(p => p.name_th === this.selectedProvince);
    const selectedDistrictData = provinceData?.amphure.find((a: any) => a.name_th === district);
    this.filteredSubDistricts = selectedDistrictData ? selectedDistrictData.tambon.map((t: any) => t.name_th) : [];

    this.editAddressForm.patchValue({
      district: this.selectedDistrict,
      subDistrict: ''
    });
  }

  subDistrictSelect(subDistrict: string) {
    this.selectedSubDistrict = subDistrict;

    const provinceData = this.ThaiData.find(p => p.name_th === this.selectedProvince);
    const districtData = provinceData?.amphure.find((a: any) => a.name_th === this.selectedDistrict);
    const selectedSubDistrictData = districtData?.tambon.find((t: any) => t.name_th === subDistrict);

    const postalCode = selectedSubDistrictData?.zip_code || '';

    this.editAddressForm.patchValue({
      subDistrict: this.selectedSubDistrict,
      postalCode: postalCode
    });
  }

  submit() {
    if (this.editAddressForm.valid) {
      const updatedAddress: AddressModel = this.editAddressForm.value;

      Swal.fire({
        title: "ต้องการบันทึกการเปลี่ยนแปลง?",
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
    
          this.addressService.updateAddress(updatedAddress, 1, this.addressId).subscribe({
            next: () => {
              Swal.close();
              Swal.fire({
                icon: "success",
                title: "บันทึกแล้ว",
                text: "บันทึกที่อยู่เรียบร้อยแล้ว",
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
      })
    }
  }

  cancel() {
    this.editAddressForm.reset();
    this.router.navigate(['/address']);
  }

  addressNavigate(){
    this.router.navigate(['/address']);
  }
}
