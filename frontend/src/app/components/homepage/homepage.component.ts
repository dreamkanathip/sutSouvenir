import { Component } from '@angular/core';
import { HomepageService } from '../../services/homepage/homepage.service';
import { Product } from '../../interfaces/products/products.model';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { CartService } from '../../services/cart/cart.service';
import { catchError, firstValueFrom, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  addToFav!: any;
  productItems!: Product[];

  constructor(private homepageService: HomepageService, private cartService: CartService, private router: Router) {
    this.loadProducts()
  }

  loadProducts() {
    this.homepageService.getAllProducts().subscribe((result) => {
      this.productItems = result;
    });
  }

  addItemToCart(item: Product) {
    const data = {
      userId: '1',
      productId: item.id,
      quantity: '1',
    };

    this.cartService.getCartById(1).pipe(
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
          const product = this.productItems.find((i) => i.id === item.id);
          if (product && product.quantity > 0) {
            product.quantity -= 1; // Update quantity only on success
          }
          console.log('Item added to cart:', response);
        }
      });
  }
  
  goToDetails(item: any) {
    this.router.navigate(['/details', item.id]);
  }
}
