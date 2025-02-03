import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { OrderService } from '../../services/order/order.service';
import { Order } from '../../interfaces/order/order';
import { ProductOnOrder } from '../../interfaces/order/product-on-order';
import { Payment } from '../../interfaces/order/payment';
import { PaymentService } from '../../services/payment/payment.service';
import { OrderStatus } from '../../interfaces/order/status';
import { ShippingService } from '../../services/shipping/shipping.service';
import { Shipping } from '../../interfaces/shipping/shipping.model';

@Component({
  selector: 'app-admin-update-order-status',
  templateUrl: './admin-update-order-status.component.html',
  styleUrl: './admin-update-order-status.component.css',
})
export class AdminUpdateOrderStatusComponent {

  orders!: Order[];
  // payments!: Payment[]
  trackingNumber!: string;
  selectedOrder!: Order;
  filteredOrders:Order[] = [];
  filterStatus: string = "";
  statusEnum!: OrderStatus;
  orderStatus: any[] = [];
  shippings!: Shipping[];
  filterShipping: string = "";
  page: number = 1;
  itemsPerPage: number = 5;
  currentPage: number = 1;
  
  constructor(
    private orderService: OrderService, 
    private paymentService: PaymentService, 
    private shippingService: ShippingService
  ) {
    this.getAllOrder();
    this.getOrderStatusEnum();
    this.getShipping();
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
      this.filteredOrders = this.orders;
    });
  }

  get paginatedOrders() {
    const start = (this.page - 1) * this.itemsPerPage;
    const end = this.page * this.itemsPerPage;
    return this.filteredOrders.slice(start, end);
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
    this.trackingNumber = order.trackingNumber
  }

  getPaymentDate(order: Order) {
    if(order.payments[0].transferAt.getDate !== new Date(0).getDate) {
      return order.payments[0].transferAt
    } else {
      return
    }
  }
  applyFilters(): void {
    this.filteredOrders = this.orders.filter((order) => {
      const matchStatus = this.filterStatus? order.orderStatus === this.filterStatus : order.orderStatus
      const matchShipping = this.filterShipping? order.shipping.company === this.filterShipping : order.shipping.company
      return matchStatus && matchShipping;
    });
  }
  getOrderStatusEnum() {
    this.orderService.getOrderStatusEnum().subscribe((res) => {
      this.orderStatus = Object.entries(res).map(([value]) => ({ value }));
    })
  }
  getShipping() {
    this.shippingService.getAllShippings().subscribe((res) => {
      this.shippings = res;
    })
  }
  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize
  }
}
