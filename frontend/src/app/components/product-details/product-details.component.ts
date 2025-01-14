import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/products/products.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsService } from '../../services/product-details/product-details.service';
import { catchError, of, switchMap } from 'rxjs';
import { CartService } from '../../services/cart/cart.service';
import Swal from 'sweetalert2';
import { ReviewService } from '../../services/review/review.service';
import { ReviewModel } from '../../interfaces/review/review.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;
  quantityToOrder: number = 1;
  userId: number = 2;

  reviews: ReviewModel[] = []
  uniqueReview: any[] = []
  averageRating: number = 0;

  historyModal: boolean = false;
  reviewHistoryUser?: any
  reviewHistory: any[] = []

  constructor(
    private reviewService: ReviewService,
    private productDetails: ProductDetailsService,
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const productIdFromRoute = Number(routeParams.get('id'));
    this.getProductById(productIdFromRoute);
    this.listProductReview(productIdFromRoute)
  }

  getProductById(id: number) {
    this.productDetails.getProductById(id).subscribe((result) => {
      this.product = result;
    });
  }
  onQuantityInputChange(item: any): void {
    if (item.quantity < this.quantityToOrder) {
      console.log("aaaaa")
      Swal.fire({
        title: "สินค้าเกินจำนวนที่มีในคลัง",
        text: `จำนวนสินค้าในคลังมีเพียง ${item.product.quantity} ชิ้น`,
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      item.quantity = item.product.quantity;
    } else if(item.quantity <= 0) {
        item.quantity = Math.max(1, Math.min(Number(item.quantity), item.product.quantity));

      if (isNaN(item.quantity)) {
        item.quantity = 1;
      }
    }
  }
  decreaseQuantity() {
    if (this.quantityToOrder > 1) {
      this.quantityToOrder--;
    }
  }

  increaseQuantity() {
    if (this.quantityToOrder < this.product?.quantity) {
      this.quantityToOrder++;
    }
  }

  addItemToCart() {
    const data = {
      userId: this.userId,
      productId: this.product.id,
      quantity: this.quantityToOrder,
    };
    if ((this.product && this.product.quantity > 0) && (this.product.quantity - this.quantityToOrder >= 0)) {
      this.cartService.getCartById(data.userId).pipe(
        switchMap((checkCart) => {
          if (!checkCart) {
            return this.cartService.initialCart({ userId: 1, cartTotal: 0 }).pipe(
              switchMap(() => this.cartService.addItemToCart(data))
            );
          }
          return this.cartService.addItemToCart(data);
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
        )
        .subscribe((response) => {
          if (response) {
            this.product.quantity -= this.quantityToOrder;
            this.cartService.updateCartItemCount(this.userId)
            console.log('Item added to cart:', response);
            Swal.fire({
              title: "เพิ่มสินค้าเรียบร้อย",
              icon: "success",
              confirmButtonText: "ตกลง",
              confirmButtonColor: "#28a745",
            });
          } else {
              Swal.fire({
                title: "สินค้าหมดแล้ว",
                text: "โปรดรอสินค้า",
                confirmButtonText: "ตกลง",
                icon: "warning",
                confirmButtonColor: "#F36523",
            }).then(() => {
              const routeParams = this.route.snapshot.paramMap;
              const productIdFromRoute = Number(routeParams.get('id'));
              this.getProductById(productIdFromRoute);
            });
          }
      });
    } else if(this.product.quantity === 0) {
      Swal.fire({
        title: "สินค้าเกินจำนวนที่มีในคลัง",
        confirmButtonText: "ตกลง",
        icon: "warning",
      }).then(() => {
        const routeParams = this.route.snapshot.paramMap;
        const productIdFromRoute = Number(routeParams.get('id'));
        this.getProductById(productIdFromRoute);
      }).then(() => {
        const routeParams = this.route.snapshot.paramMap;
        const productIdFromRoute = Number(routeParams.get('id'));
        this.getProductById(productIdFromRoute);
      })
    } else if(this.product.quantity < this.quantityToOrder) {
      Swal.fire({
        title: "สินค้าเกินจำนวนที่มีในคลัง",
        text: `จำนวนสินค้าในคลังมีเพียง ${this.product.quantity} ชิ้น`,
        icon: "warning",
        confirmButtonText: "ตกลง",
      }).then(() => {
        this.quantityToOrder = this.product.quantity
        const routeParams = this.route.snapshot.paramMap;
        const productIdFromRoute = Number(routeParams.get('id'));
        this.getProductById(productIdFromRoute);
      })
    }
  }

  listProductReview(id: number) {
    this.reviewService.listReview(id).subscribe((result) => {
      if (result) {
        this.reviews = result.reviews;
        const uniqueReviewsMap = new Map<number, any>(); // Map สำหรับเก็บข้อมูล unique reviews
        result.reviews.forEach((review: any) => {
          if (!uniqueReviewsMap.has(review.userId)) {
            uniqueReviewsMap.set(review.userId, review); // เพิ่มรีวิวที่ไม่ซ้ำ
          } else {
            const existingReview = uniqueReviewsMap.get(review.userId);
            // อัพเดตเฉพาะรีวิวที่มี createdAt ล่าสุด
            if (new Date(review.createdAt) > new Date(existingReview.createdAt)) {
              uniqueReviewsMap.set(review.userId, review);
            }
          }
        });
        // แปลง Map เป็น Array
        this.uniqueReview = Array.from(uniqueReviewsMap.values());
      }

      const totalStars = this.uniqueReview.reduce((sum, review) => sum + review.star, 0);
      this.averageRating = this.uniqueReview.length > 0 ? totalStars / this.uniqueReview.length : 0;

      // console.log("Reviews:", this.reviews);
      // console.log("Unique Reviews:", this.uniqueReview)
      // console.log("Average Rating:", this.averageRating);
    });
  }

  checkReviewHistory(id: number) {
    const history = this.reviews.filter(review => review.userId === id);
    if (history.length >= 2) {
      return true
    } else {
      return false
    }
  }

  showHistory(id: number) {
    this.reviewHistory = this.reviews.filter(review => review.userId === id);
    this.reviewHistoryUser = this.reviewHistory[0].user;
    this.historyModal = true
  }

  closeHistory() {
    this.historyModal = false
  }

  NavigateToReview(id: any){
    this.router.navigate(['/review', id])
  }
}
