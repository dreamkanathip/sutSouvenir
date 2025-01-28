import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-update-order-status-detail',
  templateUrl: './admin-update-order-status-detail.component.html',
  styleUrl: './admin-update-order-status-detail.component.css'
})
export class AdminUpdateOrderStatusDetailComponent {
  isModalOpen: boolean = false; // สถานะเปิด/ปิด Modal
  selectedImage: string = '';  // เก็บ URL รูปภาพที่เลือก

  openImageModal(imageUrl: string): void {
    this.selectedImage = imageUrl;
    this.isModalOpen = true;
  }

  // ฟังก์ชันปิด Modal
  closeImageModal(): void {
    this.isModalOpen = false;
    this.selectedImage = '';
  }
}
