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

  constructor(
    private homepageService: HomepageService,
    private cartService: CartService
  ) {
    this.loadProducts();
  }

  loadProducts() {
    this.homepageService.getAllProducts().subscribe((result) => {
      this.productItems = result;
    });
  }

  addItemToCart(productId: any) {
    this.dataForm.patchValue({
      userId: '1',
      productId: productId,
      quantity: '1',
    });

    const data = {
      userId: this.dataForm.get('userId')?.value ?? '',
      productId: this.dataForm.get('productId')?.value ?? '',
      quantity: this.dataForm.get('quantity')?.value ?? '',
    };

    console.log('Data to send:', data);

    this.cartService.addItemToCart(data).subscribe((res) => {
      console.log(res);
    });
  }
}
