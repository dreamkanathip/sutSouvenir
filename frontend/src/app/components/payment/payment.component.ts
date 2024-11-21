import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductOnCart } from '../../interfaces/carts/product-on-cart';
import { Carts } from '../../interfaces/carts/carts';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {

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
  }

  ngOnInit(): void {
    this.getProductOnCart(1)
    this.getCartById(1)
    this.toggleSelectAll()
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
  increaseQuantity(item: any){
    item.quantity++;
    this.updateTotalPrice();
  }
  
  decreaseQuantity(item: any){
    if (item.quantity > 1) {
      item.quantity--;
      this.updateTotalPrice();
    }
  }
  updateTotalPrice(): void {
    this.sumItemPrice = this.productOnCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
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

  removeProductOnCart(productId: any) {
    const data = {
      userId: 1,
      productId: productId
    }
    console.log(data)
    this.cartService.removeProductOnCart(data).subscribe((res) => {
      console.log(res)
      this.getProductOnCart(data.userId)
    })
  }
}
