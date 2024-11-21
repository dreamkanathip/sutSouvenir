import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddressService } from '../../../services/address/address.service';
import { AddressModel } from '../../../interfaces/address/address.model';

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
        postalCode: result.postalCode
      });

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
      // this.addressService.updateAddress(updatedAddress).subscribe(() => {
      //   this.router.navigate(['/address']);
      // });
    }
  }

  cancel() {
    this.editAddressForm.reset();
    this.router.navigate(['/address']);
  }
}
