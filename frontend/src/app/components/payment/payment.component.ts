import { Component, OnInit, ViewChild} from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductOnCart } from '../../interfaces/carts/product-on-cart';
import { Carts } from '../../interfaces/carts/carts';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit{

  @ViewChild(CartComponent) cartComponent!: CartComponent;
  
  dataForm = new FormGroup({
    userID: new FormControl(''),
    productId: new FormControl(''),
    quantity: new FormControl('')
  })

  productOnCart!: ProductOnCart[];
  cart!: Carts
  selectAll: boolean = false;
  sumItemPrice: number = 0;

  constructor(private cartService: CartService) {
    this.getSelectedProductOnCart()
  }

  ngOnInit(): void {
    this.getProductOnCart(1)
    this.getCartById(1)
  }

  getProductOnCart(userId: any) {
    this.cartService.getProductOnCart(userId).subscribe((res) => {
      this.productOnCart = res.map((item: any) => ({...item, selected: false}))
    })
  }
  getCartById(userId: any) {
    this.cartService.getCartById(userId).subscribe((res) => {
      this.cart = res
    })
  }
  individualSelect(productId: any) {
    const item = this.productOnCart.find((i) => i.productId === productId)
    if(item) {
      item.selected = !item.selected
      this.calculateSumItemPrice()
    }
  }
  checkIndividualSelect() {
    this.selectAll = this.productOnCart.every((i) => i.selected);
  }

  calculateSumItemPrice(){
    const selectedItem = this.productOnCart.filter((i) => i.selected === true)
    if(selectedItem){
      this.sumItemPrice = selectedItem.reduce((acc, curr) => acc + curr.price, 0)
    } 
  }

  updateTotalPrice(): void {
    this.sumItemPrice = this.productOnCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  getSelectedProductOnCart() {
    const selectedItem = this.cartComponent.productOnCart.filter((i) => i.selected === true)
    this.productOnCart = selectedItem
  }
}
