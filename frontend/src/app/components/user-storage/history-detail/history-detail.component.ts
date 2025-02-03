import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ProductOnOrder } from '../../../interfaces/order/product-on-order';
import { Order } from '../../../interfaces/order/order';
import { OrderService } from '../../../services/order/order.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import Swal from 'sweetalert2';
import { ReviewModel } from '../../../interfaces/review/review.model';
import { Product } from '../../../interfaces/products/products.model';
import { ReviewService } from '../../../services/review/review.service';

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrl: './history-detail.component.css'
})
export class HistoryDetailComponent implements OnInit, OnChanges {

  @Input() order?: any 
  @Input() productRating?: any
  @Output() getUserStorageItem = new EventEmitter<void>();
  productOnOrderTotal: number = 0
  productReviewList: ReviewModel[] = [];
  selectedProductToReview?: Product;
  selectedProduct: any; // ใช้เก็บข้อมูลสินค้าที่เลือกสำหรับรีวิว
  
  userReview!: ReviewModel[]
  productReview!: ReviewModel[]

  constructor(
    private orderService: OrderService,
    private router: Router,
    private reviewService: ReviewService
  ) {
  }

  ngOnInit() {
    this.calculateProductOnOrderTotal();
    this.getReview();
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
  getReview() {
    this.reviewService.getUserReview().subscribe({
      next: (reviews) => {
        this.userReview = reviews;
      },
    });
  }
  showStatus(status: string) {
    switch (status) {
      case 'PENDING': return 'รอชำระเงิน';
      case 'CANCELLED': return 'ยกเลิก';
      case 'SHIPPED': return 'กำลังจัดส่ง';
      case 'DELIVERED': return 'จัดส่งสำเร็จ';
      case 'PROCESSED': return 'ยืนยันการสั่งซื้อ';
      case 'NOT_PROCESSED' : return 'รอยืนยัน';
      default: return 'สถานะการสั่งซื้อผิดพลาด'
      // NOT_PROCESSED
      // PROCESSED
      // SHIPPED
      // DELIVERED
      // CANCELLED
    }
  }

  submitCancel(item: any) {
    const customSwal = Swal.mixin({
      customClass:{
        popup: "title-swal",
        confirmButton: "text-swal",
        cancelButton: "text-swal",
      },
    });
    customSwal.fire({
      title: "ต้องการยกเลิกคำสั่งซื้อรายการนี้หรือไม่?",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "กลับ",
      icon: "warning",
    }).then((result) => {
      if (result.isConfirmed) {
        customSwal.fire({
          title: "กำลังลบข้อมูล...",
          allowOutsideClick: false,
          didOpen: () => {
            customSwal.showLoading();
          },
        });

        this.orderService.cancelOrder(item.id, item).subscribe({
          next: (res) => {
            customSwal.close();
              customSwal.fire({
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
            customSwal.close();
            customSwal.fire({
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
  getImageUrl(item: Product): string {
    if (item.images && item.images.length > 0) {
      return String(item.images[0].url) + String(item.images[0].asset_id);
    }
    return 'assets/SUT-Logo.png';
  }
  NavigateToPayment(item: Order) {
    this.orderService.setOrderId(item.id)
    this.router.navigate(['/payment'])
  }
  changeStatusToDELIVERED(order: any) {
    const data = {
      orderId: order.id,
      orderStatus: "DELIVERED"
    }
    const customSwal = Swal.mixin({
      customClass:{
        popup: "title-swal",
        confirmButton: "text-swal",
        cancelButton: "text-swal",
      },
    });

    customSwal.fire({
      title: "ต้องการยืนยันรับสินค้าหรือไม่?",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "กลับ",
      icon: "warning",
    }).then((result) => {
      if (result.isConfirmed) {
        customSwal.fire({
          title: "กำลังดำเนินการ...",
          allowOutsideClick: false,
          didOpen: () => {
            customSwal.showLoading();
          },
        });

        this.orderService.changeOrderStatus(data).subscribe({
          next: () => {
            customSwal.close();
              customSwal.fire({
                icon: "success",
                title: "ยืนยันรับสินค้าสำเร็จ",
                showConfirmButton: true,
              }).then(() => {
                this.getUserStorageItem.emit();
                window.location.reload();
              })
          },
          error: (error) => {
            customSwal.close();
            customSwal.fire({
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
  roundRating(rating: number): number {
    return Math.floor(rating);
  }
  
  isHalfStar(rating: number, index: number): boolean {
    return index === Math.floor(rating) && rating % 1 >= 0.5;
  }
  
  fullStars(rating: number, index: number): boolean {
    return index < Math.floor(rating);
  }
  
  emptyStars(rating: number, index: number): boolean {
    return index >= Math.ceil(rating);
  }
}
