import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Order } from '../../../interfaces/order/order';
import { Payment } from '../../../interfaces/order/payment';
import { Product } from '../../../interfaces/products/products.model';
import { ProductOnOrder } from '../../../interfaces/order/product-on-order';
import { OrderService } from '../../../services/order/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-update-order-status-detail',
  templateUrl: './admin-update-order-status-detail.component.html',
  styleUrl: './admin-update-order-status-detail.component.css'
})
export class AdminUpdateOrderStatusDetailComponent implements OnInit, OnChanges {
  isModalOpen: boolean = false; // สถานะเปิด/ปิด Modal
  selectedImage: string | undefined = '';  // เก็บ URL รูปภาพที่เลือก
  @Input() order?: Order;
  @Input() payment?: Payment | null;

  productOnOrderTotal: number = 0
  @Input() trackingNumber!: string

  constructor(private orderService: OrderService) {
    this.calculateProductOnOrderTotal();
  }
  ngOnInit() {
    this.calculateProductOnOrderTotal();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['order']) {
      this.calculateProductOnOrderTotal();
    }
  }
  openImageModal(imageUrl: string | undefined): void {
    this.selectedImage = 'https://sutsouvenir-seniorproject.s3.ap-southeast-1.amazonaws.com/' + imageUrl;
    this.isModalOpen = true;
  }

  closeImageModal(): void {
    this.isModalOpen = false;
    this.selectedImage = '';
  }
  calculateProductOnOrderTotal() {
    this.productOnOrderTotal = this.order?.products?.reduce(
      (sum: number, p: ProductOnOrder) => sum + (p.price), 0) || 0
  }
  
  showOrderStatus() {
    switch (this.order?.orderStatus) {
      case 'PENDING': return 'รอชำระเงิน';
      case 'CANCELLED': return 'ยกเลิก';
      case 'SHIPPED': return 'กำลังจัดส่ง';
      case 'DELIVERED': return 'จัดส่งสำเร็จ';
      case 'PROCESSED': return 'ยืนยันการสั่งซื้อ';
      case 'NOT_PROCESSED': return 'รอยืนยัน';
      default: return 'สถานะการสั่งซื้อผิดพลาด'
    }
  }
  showPaymentStatus() {
    switch (this.order?.payments?.[0].status) {
      case 'NOT_PROCESSED': return 'รอยืนยัน';
      case 'COMPLETED': return 'สมบูรณ์';
      case 'FAILED': return 'เกิดข้อผิดพลาด';
      case 'PENDING': return 'ยังไม่ชำระ';
      default: return 'สถานะการสั่งซื้อผิดพลาด'
    }
  }
  getReceipt() {
    return this.order?.payments?.[0].receipt
  }
  getImageUrl(item: Product): string {
    if (item.images && item.images.length > 0) {
      return String(item.images[0].url) + String(item.images[0].asset_id);
    }
    return 'assets/SUT-Logo.png';
  }
  confirmOrder() {
    const data = {
      orderId: this.order?.id
    }
    const customSwal = Swal.mixin({
      customClass: {
        popup: 'title-swal',
        title: 'title-swal',
        confirmButton: "text-swal",
        cancelButton: "text-swal",
      },
    });
    customSwal.fire({
      title: "ต้องการยืนยันการชำระเงินของรายการนี้หรือไม่?",
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
      }
      this.orderService.confirmOrder(data).subscribe({
        next: (res) => {
          customSwal.close();
          customSwal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: "ยืนยันการชำระเงินเรียบร้อย",
            showConfirmButton: true,
          }).then(() => {
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
    })
  }
  addTrackingNumber() {
    const data = {
      orderId: this.order?.id,
      trackingNumber: this.trackingNumber
    }
    const customSwal = Swal.mixin({
    customClass: {
      popup: 'title-swal',
      title: 'title-swal',
      confirmButton: "text-swal",
      cancelButton: "text-swal",

    },
  });
  customSwal.fire({
    title: "ต้องการเพิ่มเลข Tracking ของรายการนี้หรือไม่?",
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
    }
    this.orderService.addTracking(data).subscribe({
      next: (res) => {
        customSwal.close();
        customSwal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "พิ่มเลข Tracking เรียบร้อย",
          showConfirmButton: true,
        }).then(() => {
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
  })
    
  }
}