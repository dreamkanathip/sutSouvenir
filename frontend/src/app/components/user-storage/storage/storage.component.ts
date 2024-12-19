import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { Router } from "@angular/router"
import { ReviewService } from '../../../services/review/review.service';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css'
})
export class StorageComponent implements OnInit{

  order: any[] = []
  storage: any[] = [];

  constructor(private userService: UserService, private router: Router, private reviewService: ReviewService) {}

  ngOnInit() {
    this.getUserStorageItem();
  }

  getUserStorageItem() {
    this.userService.getUserStorage().subscribe({
      next: (items) => {
        let orders = items.orders;  // ดึงข้อมูล orders
      if (orders) {
        orders.forEach((order: any) => {
          if (order.products) {
            // product ภายใน order
            order.products.forEach((productOnOrder: any) => {
              const product = productOnOrder.product;
              // ตรวจสอบว่า product ซ้ำหรือไม่
              const isProductExists = this.storage.some(existingProduct => existingProduct.id === product.id);

              // ถ้า product ยังไม่อยู่ใน storage ก็เพิ่ม
              if (!isProductExists) {
                this.storage.push(product);  // เพิ่ม product ใน storage
              }
            });
          }
        })
      };
      },
      error: (err) => {
        console.error('Error fetching user storage items', err);
      }
    });
  }

  NavigateToProduct(item: any){
    this.router.navigate(['/details', item.id]);
  }

  NavigateToReview(item: any){
    this.router.navigate(['/review', item.id])
  }

}
