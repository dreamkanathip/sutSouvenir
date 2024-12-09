import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/products/products.model';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailsService } from '../../services/product-details/product-details.service';
import { catchError, of, switchMap } from 'rxjs';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;
  quantityToOrder: number = 1;

  constructor(
    private productDetails: ProductDetailsService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const productIdFromRoute = Number(routeParams.get('id'));
    this.getProductById(productIdFromRoute);
  }

  getProductById(id: number) {
    this.productDetails.getProductById(id).subscribe((result) => {
      this.product = result;
    });
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
      userId: '1',
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
          console.log('Item added to cart:', response);
        }
      });
  }
}
