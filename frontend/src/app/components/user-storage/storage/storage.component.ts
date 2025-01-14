import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { Router } from "@angular/router"
import { ReviewService } from '../../../services/review/review.service';
import { ReviewModel } from '../../../interfaces/review/review.model';
import { Order } from '../../../interfaces/order/order';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css'
})
export class StorageComponent implements OnInit{

  order: Order[] = []
  storage: any[] = [];

  reviewList: ReviewModel[] = []

  reviewModal: boolean = false
  reviewProduct?: any
  productReviewList: ReviewModel[] = []

  constructor(private userService: UserService, private router: Router, private reviewService: ReviewService) {}

  ngOnInit() {
    this.getUserStorageItem();
    this.getReview()
  }

  getUserStorageItem() {
    this.userService.getUserStorage().subscribe({
      next: (items) => {
        console.log(items)
        // กรองเฉพาะคำสั่งซื้อที่มีสถานะ DELIVERED
        const confirmedOrders = items.orders.filter(
          order => order.orderStatus === "DELIVERED"
        );
        let orders = confirmedOrders;
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
                this.storage.push(product);
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

  getReview(){
    this.reviewService.getUserReview().subscribe({
      next: (reviews) => {
        this.reviewList = reviews
      }
    })
  }

  showModal(item: any){
    this.productReviewList = []
    this.productReviewList = this.reviewList.filter(review => review.productId === item.id)
    this.reviewProduct = item
    this.reviewModal = true
  }

  closeModal(){
    this.reviewModal = false
  }

  NavigateToProduct(item: any){
    this.router.navigate(['/details', item.id]);
  }

  NavigateToReview(item: any){
    this.router.navigate(['/review', item.id])
  }
}
