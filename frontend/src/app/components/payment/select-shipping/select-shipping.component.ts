import { Component, EventEmitter, Output } from '@angular/core';
import { ShippingService } from '../../../services/shipping/shipping.service';
import { Shipping } from '../../../interfaces/shipping/shipping.model';

@Component({
  selector: 'app-select-shipping',
  templateUrl: './select-shipping.component.html',
  styleUrl: './select-shipping.component.css'
})
export class SelectShippingComponent {

  
  @Output() selectedShippingChange = new EventEmitter<Shipping>();
  shippings!: Shipping[]
  selectedShipping!: Shipping
  constructor(private shippingService: ShippingService) {
    this.getShipping()
  }

  getShipping() {
    this.shippingService.getAllShippings().subscribe(res => {
      this.shippings = res
    })
  }
  
  onShippingChange(s: any) {
    this.selectedShipping = s;
    this.selectedShippingChange.emit(this.selectedShipping);
  }
}
