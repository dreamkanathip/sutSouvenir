import { Component } from '@angular/core';
import { HomepageService } from '../../services/homepage/homepage.service';
import { Product } from '../../interfaces/products/products.model';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  addToFav!: any;
  productItems!: Product[];

  dataForm = new FormGroup({
    userId: new FormControl(''),
    productId: new FormControl(''),
    quantity: new FormControl(''),
  });

  constructor(private homepageService: HomepageService, private cartService: CartService, private router: Router) {
    this.loadProducts()
  }

  loadProducts() {
    this.homepageService.getAllProducts().subscribe((result) => {
      this.productItems = result;
    });
  }

  addItemToCart(item: any) {
    this.dataForm.patchValue({
      userId: '1',
      productId: item.id,
      quantity: '1',
    });

    const data = {
      userId: this.dataForm.get('userId')?.value ?? '',
      productId: this.dataForm.get('productId')?.value ?? '',
      quantity: this.dataForm.get('quantity')?.value ?? '',
    };

    console.log('Data to send:', data);

    // init cart first 
    this.cartService.getCartById(1).subscribe((res) => { // passing user id
      if(!res) {
        this.cartService.initialCart({userId: 1, cartTotal: 0}).subscribe(res => {
          console.log("create new cart", res)
        })
      } else {
        this.cartService.addItemToCart(data).subscribe((res) => {
          const product = this.productItems.find((i) => i.id === item.id)
          if(product) {
            item.quantity -=1
          }
        });
      }
    }) 
  }
  goToDetails(item: any) {
    this.router.navigate(['/details', item.id]);
  }
}
