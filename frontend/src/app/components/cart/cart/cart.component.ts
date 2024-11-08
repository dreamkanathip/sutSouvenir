import { Component } from '@angular/core';
import { CartService } from '../../../services/cart/cart.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {

  dataForm = new FormGroup({
    userID: new FormControl(''),
    productId: new FormControl(''),
    quantity: new FormControl('')
  })

  constructor(private cartService: CartService) {}

  addItemToCart() {
    this.cartService.addItemToCart(this.dataForm)
  }
  
}
