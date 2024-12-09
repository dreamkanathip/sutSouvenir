import { Component, OnInit} from '@angular/core';
import { OrderService } from '../../services/order/order.service';
import { ProductOnOrder } from '../../interfaces/order/product-on-order';
import { ActivatedRoute } from '@angular/router';
import { AddressModel } from '../../interfaces/address/address.model';
import { AddressService } from '../../services/address/address.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit{
  
  productOnOrder!: ProductOnOrder[];
  sumItemPrice: number = 0;
  defaultAddress?: AddressModel
  constructor(
    private orderService: OrderService, 
    private activatedRoute: ActivatedRoute,
    private addressService: AddressService
  ) {  
  }

  ngOnInit(): void {
    const routeParams = this.activatedRoute.snapshot.paramMap;
    const id = Number(routeParams.get('id'));
    this.getProductOnOrder(id);

    this.getDefaultAddress()
  }
  getDefaultAddress() {
    this.addressService.getDefaultAddress(1).subscribe(res => {
      this.defaultAddress = res
    })
  }
  defaultAddressChanged() {
    this.getDefaultAddress()
  }
  getProductOnOrder(id: any): void {
    console.log(id)
    this.orderService.getProductOnOrderById(id).subscribe({
      next: (res) => {
        this.productOnOrder = res;
        this.sumItemPrice = res.reduce((sum, item) => sum + item.price, 0)
      },
      error: (err) => {
        console.error('Failed to fetch products:', err);
      }
    });
  }
  
}
