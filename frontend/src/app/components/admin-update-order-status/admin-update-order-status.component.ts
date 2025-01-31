import { Component } from '@angular/core';
import { OrderService } from '../../services/order/order.service';
import { Order } from '../../interfaces/order/order';
import { ProductOnOrder } from '../../interfaces/order/product-on-order';

@Component({
  selector: 'app-admin-update-order-status',
  templateUrl: './admin-update-order-status.component.html',
  styleUrl: './admin-update-order-status.component.css',
})
export class AdminUpdateOrderStatusComponent {

  orders!: Order[];
  selectedOrder!: Order;
  constructor(private orderService: OrderService) {
    this.getAllOrder();
  }
  getAllOrder() {
    this.orderService.getOrders().subscribe((res) => {
      this.orders = res;
    });
  }
  showOrderStatus(status: string){
    switch (status) {
      case 'PENDING' : return 'รอชำระเงิน';
      case 'CANCELLED' : return 'ยกเลิก';
      case 'SHIPPED' : return 'กำลังจัดส่ง';
      case 'DELIVERED' : return 'จัดส่งสำเร็จ';
      case 'PROCESSED' : return 'ยืนยันการสั่งซื้อ';
      case 'NOT_PROCESSED' : return 'รอยืนยัน';
      default : return 'สถานะการสั่งซื้อผิดพลาด'
    }
  }
  showPaymentStatus(status: string){
    switch (status) {
      case 'PENDING' : return 'รอยืนยัน';
      case 'COMPLETE' : return 'สมบูรณ์';
      case 'FAILED' : return 'เกิดข้อผิดพลาด';
      default : return 'สถานะการสั่งซื้อผิดพลาด'
    }
  }
  seeOrder(order: Order) {
    this.selectedOrder = order
  }
}
