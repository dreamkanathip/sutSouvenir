import { Component } from '@angular/core';
import { HomepageService } from '../../services/homepage/homepage.service';
import { Product } from '../../interfaces/products/products.model';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { CartService } from '../../services/cart/cart.service';
import { catchError, firstValueFrom, of, switchMap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  addToFav!: any;
  productItems!: Product[];
  userId: number = 1;

  constructor(
    private homepageService: HomepageService,
    private cartService: CartService,
    private router: Router
  ) {
    this.loadProducts();
  }

  loadProducts() {
    this.homepageService.getAllProducts().subscribe((result) => {
      this.productItems = result;
    });
  }

  addItemToCart(item: Product) {
    const data = {
      userId: this.userId,
      productId: item.id,
      quantity: '1',
    };

    const product = this.productItems.find((i) => i.id === item.id);
    if (product && product.quantity > 0) {
      this.cartService.getCartById(this.userId).pipe(
        switchMap((checkCart) => {
          if (!checkCart) {
            // Initialize cart if not available
            return this.cartService.initialCart({ userId: this.userId, cartTotal: 0 }).pipe(
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
          this.cartService.updateCartItemCount(this.userId);
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

  goToDetails(item: any) {
    this.router.navigate(['/details', item.id]);
  }
}
