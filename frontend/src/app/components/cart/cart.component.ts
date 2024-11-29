import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { ProductOnCart } from '../../interfaces/carts/product-on-cart';
import { Carts } from '../../interfaces/carts/carts';
import { OrderService } from '../../services/order/order.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  productOnCart!: ProductOnCart[];
  cart!: Carts
  selectAll: boolean = false;
  sumItemPrice: number = 0;
  orderId!: number

  constructor(private cartService: CartService, private orderService: OrderService, private router: Router) {
  }

  ngOnInit(): void {
    this.getProductOnCart(1) //passing userId
    this.getCartById(1) //passing userId
    this.toggleSelectAll()
  }

  getProductOnCart(userId: any) {
    const selectedMap = new Map(
      this.productOnCart?.map((item) => [item.productId, item.selected])
    );
  
    this.cartService.getProductOnCart(userId).subscribe((res) => {
      this.productOnCart = res.map((item: any) => ({
        ...item,
        selected: selectedMap.get(item.productId) || false,
      }));
  
      this.updateTotalPrice();
    });
  }
  getCartById(userId: any) {
    this.cartService.getCartById(userId).subscribe((res) => {
      this.cart = res
    })
  }
  individualSelect(productId: any) {
    const item = this.productOnCart?.find((i) => i.productId === productId)
    if(item) {
      item.selected = !item.selected
      this.calculateSumItemPrice()
    }
  }
  checkIndividualSelect() {
    this.selectAll = this.productOnCart?.every((i) => i.selected);
  }
  toggleSelectAll() {
    if(this.productOnCart){
      const newSelectState = !this.selectAll;
      this.productOnCart.forEach((i) => i.selected = newSelectState);
      this.selectAll = newSelectState; 
      this.calculateSumItemPrice()
    } else {
      console.log("No Product")
    }
  }
  calculateSumItemPrice(){
    this.sumItemPrice = this.productOnCart
      .filter((i) => i.selected)
      .reduce((acc, curr) => acc + curr.price, 0) || 0
  }

  increaseQuantity(item: any){
    const data = {
      userId: 1,
      productId: item.productId
    }
    this.cartService.increaseProductOnCart(data).subscribe({
      next: () => {
        const product = this.productOnCart.find((p) => p.productId === item.productId);
        if (product) {
          product.quantity += 1;
          this.updateTotalPrice();
        }
      },
      error: (err) => console.error('Error increasing quantity:', err),
    });
  }

  decreaseQuantity(item: any){
    const data = {
      userId: 1,
      productId: item.productId
    }
    if (item.quantity > 1) {
      this.cartService.decreaseProductOnCart(data).subscribe({
        next: () => {
          const product = this.productOnCart.find((p) => p.productId === item.productId);
          if (product) {
            product.quantity -= 1;
            this.updateTotalPrice();
          }
        },
        error: (err) => console.error('Error decreasing quantity:', err),
      });
    }
  }

  updateTotalPrice(): void {
    this.sumItemPrice = this.productOnCart?.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }
  
  removeProductOnCart(productId: any) {
    const data = {
      userId: 1,
      productId: productId
    }
    console.log(data)
    this.cartService.removeProductOnCart(data).subscribe({
      next: () => {
        this.productOnCart = this.productOnCart.filter((p) => p.productId !== productId); // Remove product locally
        this.updateTotalPrice();
      },
      error: (err) => console.error('Error removing product:', err),
    });
  }

  async goToPayment() {

    try {
      const data = {
        userId: 1,
        cartTotal: this.sumItemPrice,
      };
      const selectedItem = this.productOnCart?.filter((i) => i.selected === true);
  
      const initialOrderResponse = await firstValueFrom(this.orderService.initialOrder(data));
      this.orderId = initialOrderResponse.id;
  
      for (const item of selectedItem) {
        const detail = {
          productId: item.productId,
          orderId: this.orderId,
          quantity: item.quantity,
          total: item.product.price * item.quantity,
        };
        await firstValueFrom(this.orderService.addOrderDetail(detail));
      }
      console.log('Order and details processed successfully!');

      await this.router.navigate(['/payment', this.orderId])

    } catch (error) {
      console.error('Error during payment process:', error);
    }

  }



}
