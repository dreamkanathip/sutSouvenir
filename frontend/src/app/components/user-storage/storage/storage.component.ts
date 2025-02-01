import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { ReviewService } from '../../../services/review/review.service';
import { ReviewModel } from '../../../interfaces/review/review.model';
import { Order, userOrder } from '../../../interfaces/order/order';
import { switchMap, catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { UserModel } from '../../../interfaces/user/user.model';
import { CartService } from '../../../services/cart/cart.service';
import { Product } from '../../../interfaces/products/products.model';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css',
})
export class StorageComponent implements OnInit {
  order: Order[] = [];
  storage: Product[] = [];
  user?: UserModel;

  reviewList: ReviewModel[] = [];

  reviewModal: boolean = false;
  reviewProduct?: any;
  productReviewList: ReviewModel[] = [];

  constructor(
    private userService: UserService,
    private cartService: CartService,
    private router: Router,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.getUserStorageItem();
    this.getReview();
  }

  getUserData() {
      this.userService.getUserData().subscribe({
        next: (result: UserModel) => {
          if (result) {
            this.user = result;
          }
        },
        error: (err) => {
          console.error('Error fetching user data', err);
        }
      });
    }

  getUserStorageItem() {
    this.userService.getUserStorage().subscribe({
      next: (items: userOrder) => {
        // กรองเฉพาะคำสั่งซื้อที่มีสถานะ DELIVERED
        const confirmedOrders = items.orders.filter(
          (order) => order.orderStatus === 'DELIVERED'
        );
        let orders = confirmedOrders;
        if (orders) {
          orders.forEach((order: any) => {
            if (order.products) {
              // product ภายใน order
              order.products.forEach((productOnOrder: any) => {
                const product = productOnOrder.product;
                // ตรวจสอบว่า product ซ้ำหรือไม่
                const isProductExists = this.storage.some(
                  (existingProduct) => existingProduct.id === product.id
                );

                // ถ้า product ยังไม่อยู่ใน storage ก็เพิ่ม
                if (!isProductExists) {
                  this.storage.push(product);
                }
              });
            }
          });
        }
      },
      error: (err) => {
        console.error('Error fetching user storage items', err);
      },
    });
  }

  getReview() {
    this.reviewService.getUserReview().subscribe({
      next: (reviews) => {
        this.reviewList = reviews;
      },
    });
  }

  getImageUrl(item: Product): string {
      if (item.images && item.images.length > 0) {
        return String(item.images[0].url) + String(item.images[0].asset_id);
      }
      return 'assets/SUT-Logo.png';
    }

  showModal(item: any) {
    this.productReviewList = [];
    this.productReviewList = this.reviewList.filter(
      (review) => review.productId === item.id
      ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    this.reviewProduct = item;
    this.reviewModal = true;
  }

  latestReview(product: Product): number {

    const userReviews = this.reviewList.filter(
      (review) => review.productId === product.id
    );

    if (userReviews.length === 0) {
      return 0;
    }

    const latestReview = userReviews.reduce((latest, review) => {
      return new Date(review.createdAt) > new Date(latest.createdAt) ? review : latest;
    });

    return latestReview.star;
  }

  closeModal() {
    this.reviewModal = false;
  }

  addItemToCart(item: Product) {
        const data = {
          userId: this.user?.id,
          productId: item.id,
          quantity: '1',
        };
    
        const product = item;
        if (product && product.quantity > 0) {
          this.cartService.getCartById().pipe(
            switchMap((checkCart) => {
              if (!checkCart) {
                // Initialize cart if not available
                return this.cartService.initialCart({ userId: this.user?.id, cartTotal: 0 }).pipe(
                  switchMap(() => this.cartService.addItemToCart(data))
                );
              }
              return this.cartService.addItemToCart(data)
            }),
            catchError((err) => {
              console.error('Error during add to cart:', err);
              Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถเพิ่มสินค้าลงในรถเข็นได้ กรุณาลองอีกครั้ง",
                icon: "error",
                confirmButtonText: "ตกลง",
                confirmButtonColor: "#F36523",
              });
              return of(null);
            })
          ).subscribe((response) => {
            if (response) {
              product.quantity -= 1;
              this.cartService.updateCartItemCount();
              console.log('Item added to cart:', response);
              Swal.fire({
                title: "เพิ่มสินค้าเรียบร้อย",
                icon: "success",
                confirmButtonText: "ตกลง",
                confirmButtonColor: "#28a745",
              });
            }
          });
        } else {
          Swal.fire({
            title: "สินค้าหมดแล้ว",
            confirmButtonText: "ตกลง",
            icon: "warning",
            confirmButtonColor: "#F36523",
          });
        }
      }

  NavigateToProduct(item: any) {
    this.router.navigate(['/details', item.id]);
  }

  NavigateToReview(item: any) {
    this.router.navigate(['/review', item.id]);
  }
}
