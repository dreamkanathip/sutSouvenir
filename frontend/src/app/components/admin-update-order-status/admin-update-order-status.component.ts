import { Component } from '@angular/core';
import { OrderService } from '../../services/order/order.service';
import { Order } from '../../interfaces/order/order';
import { ProductOnOrder } from '../../interfaces/order/product-on-order';

@Component({
  selector: 'app-admin-update-order-status',
  templateUrl: './admin-update-order-status.component.html',
  styleUrl: './admin-update-order-status.component.css'
})
export class AdminUpdateOrderStatusComponent {
  order!: ProductOnOrder[];
  constructor(private orderService: OrderService) {
    this.getAllOrder()
  }
  getAllOrder() {
    this.orderService.getProductOnOrder().subscribe((res) => {
      this.order = res;
    })
  }
}
