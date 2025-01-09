import { Component } from '@angular/core';
import { HomepageService } from '../../services/homepage/homepage.service';
import { Product } from '../../interfaces/products/products.model';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { CartService } from '../../services/cart/cart.service';
import { catchError, firstValueFrom, of, switchMap } from 'rxjs';
import { ReviewService } from '../../services/review/review.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  addToFav!: any;
  productItems!: Product[];
  userId: number = 1;

  productRating!: any[]

  constructor(
    private homepageService: HomepageService,
    private cartService: CartService,
    private reviewService: ReviewService,
    private router: Router
  ) {
    this.loadProducts();
    this.loadRatings();
  }

  loadProducts() {
    this.homepageService.getAllProducts().subscribe((result) => {
      this.productItems = result;
    });
  }

  loadRatings() {
    this.reviewService.listRating().subscribe((result) => {
      this.productRating = result
    })
  }

  getProductRating(productId: number): number {
    if (!this.productRating || this.productRating.length === 0) {
      return 0;
    }
  
    const ratingData = this.productRating.find((item) => item.id === productId);
    return ratingData ? ratingData.averageRating : 0;
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
  
  addItemToCart(item: Product) {
    const data = {
      userId: this.userId,
      productId: item.id,
      quantity: '1',
    };

    this.cartService
      .getCartById(this.userId)
      .pipe(
        switchMap((checkCart) => {
          if (!checkCart) {
            return this.cartService
              .initialCart({ userId: this.userId, cartTotal: 0 })
              .pipe(switchMap(() => this.cartService.addItemToCart(data)));
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
          const product = this.productItems.find((i) => i.id === item.id);
          if (product && product.quantity > 0) {
            product.quantity -= 1; // Update quantity only on success
          }
          this.cartService.updateCartItemCount(this.userId);
          console.log('Item added to cart:', response);
        }
      });
  }

  goToDetails(item: any) {
    this.router.navigate(['/details', item.id]);
  }
}
