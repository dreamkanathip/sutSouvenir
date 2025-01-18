import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ProductOnOrder } from '../../../interfaces/order/product-on-order';
import { Order } from '../../../interfaces/order/order';
import { OrderService } from '../../../services/order/order.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrl: './history-detail.component.css'
})
export class HistoryDetailComponent implements OnInit, OnChanges {

  @Input() order!: any
  @Output() getUserStorageItem = new EventEmitter<void>();
  productOnOrderTotal: number = 0
  historyModal: boolean = false

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.calculateProductOnOrderTotal();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['order']) {
      this.calculateProductOnOrderTotal();
    }
  }

  calculateProductOnOrderTotal() {
    this.productOnOrderTotal = this.order?.products?.reduce(
      (sum: number, p: ProductOnOrder) => sum + (p.price), 0) || 0
  }

  showStatus(status: string) {
    switch (status) {
      case 'NOT_PROCESSED': return 'รอชำระเงิน';
      case 'CANCELLED': return 'ยกเลิก';
      case 'SHIPPED': return 'กำลังจัดส่ง';
      case 'DELIVERED': return 'จัดส่งสำเร็จ';
      case 'PROCESSED': return 'ยืนยันการสั่งซื้อ'
      default: return 'สถานะการสั่งซื้อผิดพลาด'
      // NOT_PROCESSED
      // PROCESSED
      // SHIPPED
      // DELIVERED
      // CANCELLED
    }
  }

  submitCancel(item: any) {
    Swal.fire({
      title: "ต้องการยกเลิกคำสั่งซื้อรายการนี้หรือไม่?",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "กลับ",
      icon: "warning",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "กำลังลบข้อมูล...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        this.orderService.cancelOrder(item.id, item).subscribe({
          next: (res) => {
            Swal.close();
              Swal.fire({
                icon: "success",
                title: "ยกเลิกคำสั่งซื้อ",
                text: "ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว",
                showConfirmButton: true,
              }).then(() => {
                this.getUserStorageItem.emit();
                window.location.reload();
              })
          },
          error: (error) => {
            Swal.close();
            Swal.fire({
              icon: "warning",
              title: "เกิดข้อผิดพลาด",
              text: "เกิดข้อผิดพลาด กรุณาลองอีกครั้งในภายหลัง",
              showConfirmButton: true,
            });
            console.error("API error:", error);
          }
        });
      }
    })
  }

  NavigateToPayment(item: Order) {
    console.log(item)
    this.orderService.setOrderId(item.id)
    this.router.navigate(['/payment'])
  }

  closeHistory() {
    this.historyModal = false
  }

  changeStatusToDELIVERED(order: any) {
    const data = {
      orderId: order.id,
      orderStatus: "DELIVERED"
    }

    Swal.fire({
      title: "ต้องการยืนยันรับสินค้าหรือไม่?",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "กลับ",
      icon: "warning",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "กำลังดำเนินการ...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        this.orderService.changeOrderStatus(data).subscribe({
          next: () => {
            Swal.close();
              Swal.fire({
                icon: "success",
                title: "ยืนยันรับสินค้าสำเร็จ",
                showConfirmButton: true,
              }).then(() => {
                this.getUserStorageItem.emit();
                window.location.reload();
              })
          },
          error: (error) => {
            Swal.close();
            Swal.fire({
              icon: "warning",
              title: "เกิดข้อผิดพลาด",
              text: "ไม่สามารถดึงข้อมูลออเดอร์ใหม่ได้ กรุณาลองอีกครั้ง",
              showConfirmButton: true,
            });
            console.error("Error fetching updated order:", error);
          },
        })
      }
    })
  }
}
