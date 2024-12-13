import { Component } from '@angular/core';
import { HomepageService } from '../../services/homepage/homepage.service';
import { Product } from '../../interfaces/products/products.model';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { CartService } from '../../services/cart/cart.service';
import { FavouriteService } from '../../services/favourite/favourite.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  productItems!: Product[];

  dataForm = new FormGroup({
    userId: new FormControl(''),
    productId: new FormControl(''),
    quantity: new FormControl(''),
  });

  constructor(
    private homepageService: HomepageService,
    private favouriteService: FavouriteService,
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

  addItemToCart(productId: any) {
    this.dataForm.patchValue({
      userId: '1',
      productId: productId,
    });

    const data = {
      userId: this.dataForm.get('userId')?.value ?? '',
      productId: this.dataForm.get('productId')?.value ?? '',
      quantity: this.dataForm.get('quantity')?.value ?? '',
    };

    console.log('Data to send:', data);

    this.cartService.addItemToCart(data).subscribe((res) => {
      console.log(res);
      this.loadProducts();
    });
  }

  goToDetails(itemId: number) {
    this.router.navigate(['/details', itemId]);
  }

  // ฟังก์ชันสำหรับกดถูกใจสินค้า
  likeProduct(userId: number, productId: number): void {
    this.homepageService.likeProduct(userId, productId).subscribe(
      (response) => {
        console.log('Product liked successfully', response);
        this.loadProducts(); // อัพเดตรายการสินค้าที่ถูกกดถูกใจ
      },
      (error) => {
        console.error('Error liking product', error);
      }
    );
  }
}
