import { Component, OnInit } from '@angular/core';
import { FavouriteService } from '../../services/favourite/favourite.service'; // นำเข้า FavouriteService
import { Product } from '../../interfaces/products/products.model'; // นำเข้า interface Product
import { FavouriteResponse } from '../../interfaces/favourite/favourite.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.css'],
})
export class FavouriteComponent implements OnInit {
  likeList!: FavouriteResponse[]; // รายการสินค้าที่ถูกกดถูกใจ
  userId: number = 1;

  productList : Product[] = []

  constructor(private favouriteService: FavouriteService, private router: Router) {}

  ngOnInit(): void {
    this.getProductList();
  }

  getProductList() {
    this.productList = []
    this.favouriteService.getLikedProducts(this.userId).subscribe((result) => {
      this.likeList = result
      if (this.likeList) {
        this.likeList.forEach(list => {
          this.productList.push(list.product)
        })
      }
    })
  }

  removeFromFavourites(productId: number): void {
    Swal.fire({
      title: "ต้องการลบสินค้านี้ออกจากรายการโปรดหรือไม่",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      icon: "warning",
    }).then((result) => {
      if (result.isConfirmed) {
        this.favouriteService.removeFromFavourites(this.userId, productId).subscribe(
          (result) => {
            this.getProductList();
          },
          (error) => {
            console.error('Error removing from favourites', error);
          }
        );
      }
    })
  }

  goToDetails(item: any) {
    this.router.navigate(['/details', item.id]);
  }
}
