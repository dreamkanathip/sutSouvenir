import { Component, Input } from '@angular/core';
import { Order } from '../../../interfaces/order/order';

@Component({
  selector: 'app-admin-update-order-status-detail',
  templateUrl: './admin-update-order-status-detail.component.html',
  styleUrl: './admin-update-order-status-detail.component.css'
})
export class AdminUpdateOrderStatusDetailComponent {
  isModalOpen: boolean = false; // สถานะเปิด/ปิด Modal
  selectedImage: string | undefined = '';  // เก็บ URL รูปภาพที่เลือก
  @Input() order?: Order;

  openImageModal(imageUrl: string | undefined): void {
    this.selectedImage = 'https://sutsouvenir-seniorproject.s3.ap-southeast-1.amazonaws.com/' + imageUrl;
    this.isModalOpen = true;
  }

  // ฟังก์ชันปิด Modal
  closeImageModal(): void {
    this.isModalOpen = false;
    this.selectedImage = '';
  }
  showOrderStatus(){
    switch (this.order?.orderStatus) {
      case 'PENDING' : return 'รอชำระเงิน';
      case 'CANCELLED' : return 'ยกเลิก';
      case 'SHIPPED' : return 'กำลังจัดส่ง';
      case 'DELIVERED' : return 'จัดส่งสำเร็จ';
      case 'PROCESSED' : return 'ยืนยันการสั่งซื้อ';
      case 'NOT_PROCESSED' : return 'รอยืนยัน';
      default : return 'สถานะการสั่งซื้อผิดพลาด'
    }
  }
  showPaymentStatus(){
    switch (this.order?.payments[0].status) {
      case 'PENDING' : return 'รอยืนยัน';
      case 'COMPLETE' : return 'สมบูรณ์';
      case 'FAILED' : return 'เกิดข้อผิดพลาด';
      default : return 'สถานะการสั่งซื้อผิดพลาด'
    }
  }
  getReceipt() {
    return this.order?.payments[0].receipt
  }
}
