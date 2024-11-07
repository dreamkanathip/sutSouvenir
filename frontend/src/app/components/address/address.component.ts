import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from '../../services/address/address.service';
import { AddressModel } from '../../interfaces/address/address.model';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit{

  allAddress?: AddressModel[]

  testData: any = [
    {"name":"สิรภพ ศิริอาภากุล","address":"52/162 สุรนารีวิลล์","phone":"0933212732"},
    {"name":"สุชาดา แจ้งใหม่", "address":"4526 กรุงเทพมหานคร", "phone":"0875632156"}
  ]

  constructor(private router: Router, private addressService: AddressService) {
    this.getAllAddress()
  }

  ngOnInit(): void {
    
  }

  getAllAddress(){
    this.addressService.getAllAddress(1).subscribe((result: any) => {
      this.allAddress = result
    })
  }

  addNavigate() {
    this.router.navigate(['/addAddress']);
  }

  editAddressNavigate(id: number) {
    this.addressService.selectedEditAddress(id)
    this.router.navigate(['/editAddress']);
  }

  setDefaultAddress(){
    
  }

}
