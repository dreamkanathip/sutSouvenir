import { Component, OnInit} from '@angular/core';
import { OrderService } from '../../services/order/order.service';
import { ProductOnOrder } from '../../interfaces/order/product-on-order';
import { Router } from '@angular/router';
import { AddressModel } from '../../interfaces/address/address.model';
import { AddressService } from '../../services/address/address.service';
import { Shipping } from '../../interfaces/shipping/shipping.model';
import { Order } from '../../interfaces/order/order';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit{
  
  productOnOrder!: ProductOnOrder[];
  sumItemPrice: number = 0;
  defaultAddress!: AddressModel;
  orderId: number = 0;
  selectedShipping!: Shipping
  orderSum: number = 0

  constructor(
    private orderService: OrderService, 
    private addressService: AddressService,
    private router: Router,
  ) {  
  }

  ngOnInit(): void {
    this.getDefaultAddress()
    this.orderId = this.orderService.getOrderId();
    if (this.orderId !== 0) {
      this.getProductOnOrder(this.orderId);
    } else {
      this.router.navigate(['/home'])
    }
  }
  getDefaultAddress() {
    this.addressService.getDefaultAddress().subscribe(res => {
      this.defaultAddress = res
    })
  }
  defaultAddressChanged() {
    this.getDefaultAddress()
  }
  onShippingSelected($e:any) {
    this.selectedShipping = $e
  }
  getProductOnOrder(id: any): void {
    this.orderService.getProductOnOrderById(id).subscribe({
      next: (res) => {
        this.productOnOrder = res;
        this.sumItemPrice = res.reduce((sum, item) => sum + item.price, 0)
      },
      error: (err) => {
        console.error('Failed to fetch products:', err);
      }
    });

    this.orderService.getOrderById(this.orderId).subscribe((res) => {
      this.selectedShipping = res.shipping
    });
  }
}
