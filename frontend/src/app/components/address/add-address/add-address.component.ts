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

    this.uniqueProvinces = [...new Set(this.testData.map(item => item.province))];
    this.filteredDistricts = [... new Set(this.testData.map(item => item.district))]
    this.filteredSubDistricts = [... new Set(this.testData.map(item => item.subDistrict))]

  }

  ngOnInit(): void {}

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

    this.addressForm.patchValue({
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
      this.addressForm.patchValue({
        province: this.selectedProvince
      });
    }

    // เลือกอำเภอแล้ว ทำการกรองตำบล
    this.filteredSubDistricts = this.testData
      .filter(item => item.province === this.selectedProvince && item.district === district)
      .map(item => item.subDistrict);

    this.addressForm.patchValue({
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

    this.addressForm.patchValue({
      province: this.selectedProvince,
      district: this.selectedDistrict,
      subDistrict: this.selectedSubDistrict,
      postalCode: postalCode
    });
  }
  }

  submit() {
    if (this.addressForm.valid) {
      console.log("data sent:", this.addressForm.value)
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
        title: "Do you want to save the changes?",
        showCancelButton: true,
        confirmButtonText: "Save",
        icon: "warning",
      }).then((result) => {
        if (result.isConfirmed) {
          this.addressService.createAddress(newAddress, 1).subscribe((result: any) => {
            console.log('Post response:', result);
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Category has been updated!",
              showConfirmButton: true,
            });
            this.addressForm.reset();
          });
        }
      });
    } else {
      console.log("Form is invalid", this.addressForm.value);
    }
  }
  

  cancel() {
    this.addressForm.reset()
    this.router.navigate(['/address']);
  }
}
