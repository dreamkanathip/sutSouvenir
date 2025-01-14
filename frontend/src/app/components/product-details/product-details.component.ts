import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/products/products.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsService } from '../../services/product-details/product-details.service';
import { catchError, of, switchMap } from 'rxjs';
import { CartService } from '../../services/cart/cart.service';
import { ReviewService } from '../../services/review/review.service';
import { ReviewModel } from '../../interfaces/review/review.model';
import { FavouriteService } from '../../services/favourite/favourite.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;
  quantityToOrder: number = 1;
  userId: number = 1;

  reviews: ReviewModel[] = []
  uniqueReview: any[] = []
  averageRating: number = 0;

  historyModal: boolean = false;
  reviewHistoryUser?: any
  reviewHistory: any[] = []

  likeProductStatus: boolean = false

  constructor(
    private reviewService: ReviewService,
    private productDetails: ProductDetailsService,
    private favouriteService: FavouriteService,
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const productIdFromRoute = Number(routeParams.get('id'));
    this.getProductById(productIdFromRoute);
    this.listProductReview(productIdFromRoute)
    this.checkLiked(productIdFromRoute)
  }

  getProductById(id: number) {
    this.productDetails.getProductById(id).subscribe((result) => {
      this.product = result;
    });
  }

  checkLiked(id: number) {
    this.favouriteService.checkLikeProduct(this.userId, id).subscribe((result) => {
      if (result) {
        this.likeProductStatus = true
      } else {
        this.likeProductStatus = false
      }
    })
  }

  likeProduct(item: any) {
    this.favouriteService.likeProduct(this.userId, item).subscribe((result) => {
      if (result) {
        this.likeProductStatus = true
      }
    })
  }

  unlikeProduct(item: any) {
    this.favouriteService.removeFromFavourites(this.userId, item.id).subscribe((result) => {
      if (result) {
        this.likeProductStatus = false
      }
    })
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
          return of(null); // Handle errors gracefully
        })
      )
      .subscribe((response) => {
        if (response) {
          if (this.product && this.product.quantity > 0) {
            this.product.quantity -= this.quantityToOrder; // Update quantity only on success
          }
          this.cartService.updateCartItemCount(this.userId)
          console.log('Item added to cart:', response);
        }
      });
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
