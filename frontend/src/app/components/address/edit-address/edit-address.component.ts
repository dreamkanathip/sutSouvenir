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
export class EditAddressComponent implements OnInit{

  testData: any[] = [
    { province: "นครราชสีมา", district: "เมืองนครราชสีมา", subDistrict: "โคกกรวด", postalCode: "30280" },
    { province: "นครราชสีมา", district: "เมืองนครราชสีมา", subDistrict: "จอหอ", postalCode: "30000" },
    { province: "นครราชสีมา", district: "วังน้ำเขียว", subDistrict: "วังน้ำเขียว", postalCode: "30370" },
    { province: "ขอนแก่น", district: "โนนศิลา", subDistrict: "โนนศิลา", postalCode: "40110" },
    { province: "ขอนแก่น", district: "โนนศิลา", subDistrict: "โนนแดง", postalCode: "40110" }
  ];

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

    this.uniqueProvinces = [...new Set(this.testData.map(item => item.province))];
    this.filteredDistricts = [... new Set(this.testData.map(item => item.district))]
    this.filteredSubDistricts = [... new Set(this.testData.map(item => item.subDistrict))]
  }

  ngOnInit(): void {
    
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

      // Auto-Select
      this.provinceSelect(result.province);
      this.districtSelect(result.district);
      this.subDistrictSelect(result.subDistrict);
    });
  }

  provinceSelect(province: string) {
    this.selectedProvince = province;
    this.selectedDistrict = undefined;
    this.selectedSubDistrict = undefined;

    // เลือกจังหวัดแล้ว ทำการกรองอำเภอ
    this.filteredDistricts = [
      ...new Set(this.testData
        .filter(item => item.province === province)
        .map(item => item.district)
      )
    ];
    
    this.filteredSubDistricts = [
      ...new Set(this.testData
        .filter(item => item.province === province)
        .map(item => item.subDistrict)
      )
    ];

    this.editAddressForm.patchValue({
      province: this.selectedProvince,
      district: '',
      subDistrict: ''
    });
  }

  districtSelect(district: string) {
    this.selectedDistrict = district;
    this.selectedSubDistrict = undefined;

    // เลือกอำเภอแล้ว เลือกจังหวัดให้ด้วย
    const province = this.testData.find(item => item.district === district)?.province;
    if (province) {
      this.selectedProvince = province;
      this.editAddressForm.patchValue({
        province: this.selectedProvince
      });
    }

    // เลือกอำเภอแล้ว ทำการกรองตำบล
    this.filteredSubDistricts = this.testData
      .filter(item => item.province === this.selectedProvince && item.district === district)
      .map(item => item.subDistrict);

    this.editAddressForm.patchValue({
      district: this.selectedDistrict,
      subDistrict: ''
    });
  }

  subDistrictSelect(subDistrict: string) {
    this.selectedSubDistrict = subDistrict;

    // เลือกอำเภอแล้ว เลือกจังหวัดและอำเภอให้
    const province = this.testData.find(item => item.subDistrict === subDistrict)?.province;
    const district = this.testData.find(item => item.subDistrict === subDistrict)?.district;
    const postalCode = this.testData.find(item => item.subDistrict === subDistrict)?.postalCode;

    if (province && district) {
    this.selectedProvince = province;
    this.selectedDistrict = district;

    this.editAddressForm.patchValue({
      province: this.selectedProvince,
      district: this.selectedDistrict,
      subDistrict: this.selectedSubDistrict,
      postalCode: postalCode
    });
  }
  }

  submit() {
    // patch
  }

  cancel() {
    this.editAddressForm.reset()
    this.router.navigate(['/address']);
  }

}
