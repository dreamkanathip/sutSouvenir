import { Component } from '@angular/core';
import { BankService } from '../../services/bank/bank.service';
import { DestBank } from '../../interfaces/bank/dest-bank';
import { OriginBank } from '../../interfaces/bank/origin-bank';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ShippingService } from '../../services/shipping/shipping.service';
import { Shipping } from '../../interfaces/shipping/shipping.model';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrl: './shipping.component.css'
})
export class ShippingComponent {
    shippings!: Shipping[];
    toUpdate!: Shipping;
  
    shippingForm = new FormGroup({
      shippingCompany: new FormControl(''),
      fees: new FormControl('')
    }) 


    constructor(private shippingService: ShippingService) {
      this.getCompany()
    }
  
    getCompany() {
      this.shippingService.getAllShippings().subscribe(res => {
        this.shippings= res
      })
    }
    updateShipping(item: any) {
      this.toUpdate = item
    }
}
