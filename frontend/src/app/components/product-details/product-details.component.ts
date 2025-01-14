import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/products/products.model';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailsService } from '../../services/product-details/product-details.service';
import { catchError, of, switchMap } from 'rxjs';
import { CartService } from '../../services/cart/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;
  quantityToOrder: number = 1;
  userId: number = 1;

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
}
