import { Component } from '@angular/core';
import { OrderService } from '../../services/order/order.service';
import { Order } from '../../interfaces/order/order';
import { ProductOnOrder } from '../../interfaces/order/product-on-order';
import { Payment } from '../../interfaces/order/payment';
import { PaymentService } from '../../services/payment/payment.service';

@Component({
  selector: 'app-admin-update-order-status',
  templateUrl: './admin-update-order-status.component.html',
  styleUrl: './admin-update-order-status.component.css',
})
export class AdminUpdateOrderStatusComponent {

  orders!: Order[];
  // payments!: Payment[]

  selectedOrder!: Order;
  constructor(private orderService: OrderService, private paymentService: PaymentService) {
    this.getAllOrder();
    // this.getAllPayment();
  }
  getAllOrder() {
    this.orderService.getOrders().subscribe((res) => {
      this.orders = res.map(order => {
        if (!order.payments || order.payments.length === 0) {
          order.payments = [{
            id: 0,           
            total: order.cartTotal,
            orderId: order.id,
            addressId: order.addressId,
            originBankId: 1,
            destBankId: 1,
            userId: order.userId,
            receipt: '-',
            lastFourDigits: '-',
            status: 'PENDING',
            transferAt: new Date(0),
          }]
        }
        return order;
      });
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
      case 'NOT_PROCESSED' : return 'รอยืนยัน';
      case 'COMPLETED' : return 'สมบูรณ์';
      case 'FAILED' : return 'เกิดข้อผิดพลาด';
      case 'PENDING': return 'ยังไม่ชำระ';
      default : return 'สถานะการสั่งซื้อผิดพลาด'
    }
  }
  seeOrder(order: Order) {
    this.selectedOrder = order
  }
  getPaymentDate(order: Order) {
    if(order.payments[0].transferAt.getDate !== new Date(0).getDate) {
      return order.payments[0].transferAt
    } else {
      return
    }
  }
}
