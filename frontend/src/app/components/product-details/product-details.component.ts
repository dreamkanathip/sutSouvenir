import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/products/products.model';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailsService } from '../../services/product-details/product-details.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;
  quantityToOrder: number = 1;
  constructor(
    private productDetails: ProductDetailsService,
    private route: ActivatedRoute
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
}
