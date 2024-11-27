import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductOnCart } from '../../interfaces/carts/product-on-cart';
import { Carts } from '../../interfaces/carts/carts';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

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
    const item = this.productOnCart.find((i) => i.productId === productId)
    if(item) {
      item.selected = !item.selected
      this.calculateSumItemPrice()
    }
  }
  checkIndividualSelect() {
    this.selectAll = this.productOnCart.every((i) => i.selected);
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
    const selectedItem = this.productOnCart.filter((i) => i.selected === true)
    if(selectedItem){
      this.sumItemPrice = selectedItem.reduce((acc, curr) => acc + curr.price, 0)
    } 
  }

  increaseQuantity(item: any){
    const data = {
      userId: 1,
      productId: item.productId
    }
    this.cartService.increaseProductOnCart(data).subscribe((res) => {
      console.log(res)
      this.getProductOnCart(data.userId)
    })
  }

  decreaseQuantity(item: any){
    const data = {
      userId: 1,
      productId: item.productId
    }
    if(item.quantity > 1) {
      this.cartService.decreaseProductOnCart(data).subscribe((res) => {
        console.log(res)
        this.getProductOnCart(data.userId)
      })
    }
  }

  updateTotalPrice(): void {
    this.sumItemPrice = this.productOnCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
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
