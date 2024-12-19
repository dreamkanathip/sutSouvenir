import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/products/products.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsService } from '../../services/product-details/product-details.service';
import { catchError, of, switchMap } from 'rxjs';
import { CartService } from '../../services/cart/cart.service';
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
  userId: number = 1;

  reviews: ReviewModel[] = []

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

  listProductReview(id: number){
    this.reviewService.listReview(id).subscribe((result) => {
      this.reviews = result
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

  NavigateToReview(id: any){
    this.router.navigate(['/review', id])
  }
}
