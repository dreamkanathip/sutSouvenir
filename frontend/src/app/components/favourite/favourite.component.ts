import { Component, OnInit } from '@angular/core';
import { FavouriteService } from '../../services/favourite/favourite.service'; // นำเข้า FavouriteService
import { CartService } from '../../services/cart/cart.service'; // นำเข้า CartService
import { Product } from '../../interfaces/products/products.model'; // นำเข้า interface Product
import { FavouriteResponse } from '../../interfaces/favourite/favourite.model';
import { Router } from '@angular/router';
import { switchMap, catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user/user.service';
import { UserModel } from '../../interfaces/user/user.model';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.css'],
})
export class FavouriteComponent implements OnInit {
  likeList!: FavouriteResponse[]; // รายการสินค้าที่ถูกกดถูกใจ
  user?: UserModel;

  productList : Product[] = []

  constructor(
    private favouriteService: FavouriteService,
    private userService: UserService,
    private cartService: CartService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getUserData()
    this.getProductList();
  }

  getUserData() {
      this.userService.getUserData().subscribe({
        next: (result: UserModel) => {
          if (result) {
            this.user = result;
          }
        },
        error: (err) => {
          console.error('Error fetching user data', err);
        }
      });
    }

  getProductList() {
    this.productList = []
    this.favouriteService.getLikedProducts().subscribe((result) => {
      this.likeList = result
      if (this.likeList) {
        this.likeList.forEach(list => {
          this.productList.push(list.product)
        })
      }
    })
  }

  removeFromFavourites(productId: number): void {
    const customSwal = Swal.mixin({
      customClass:{
        popup: "title-swal",
        confirmButton: "text-swal",
        cancelButton: "text-swal",
      },
    });
    customSwal.fire({
      title: "ต้องการลบสินค้านี้ออกจากรายการโปรดหรือไม่",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      icon: "warning",
    }).then((result) => {
      if (result.isConfirmed) {
        this.favouriteService.removeFromFavourites(productId).subscribe(
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

  getImageUrl(item: Product): string {
    if (item.images && item.images.length > 0) {
      return String(item.images[0].url) + String(item.images[0].asset_id);
    }
    return 'assets/SUT-Logo.png';
  }

  addItemToCart(item: Product) {
      const data = {
        userId: this.user?.id,
        productId: item.id,
        quantity: '1',
      };

      const customSwal = Swal.mixin({
        customClass:{
          popup: "title-swal",
          confirmButton: "text-swal",
        },
      });
  
      const product = item;
      if (product && product.quantity > 0) {
        this.cartService.getCartById().pipe(
          switchMap((checkCart) => {
            if (!checkCart) {
              // Initialize cart if not available
              return this.cartService.initialCart({ userId: this.user?.id, cartTotal: 0 }).pipe(
                switchMap(() => this.cartService.addItemToCart(data))
              );
            }
            return this.cartService.addItemToCart(data)
          }),
          catchError((err) => {
            console.error('Error during add to cart:', err);
            customSwal.fire({
              title: "เกิดข้อผิดพลาด",
              text: "ไม่สามารถเพิ่มสินค้าลงในรถเข็นได้ กรุณาลองอีกครั้ง",
              icon: "error",
              confirmButtonText: "ตกลง",
              confirmButtonColor: "#F36523",
            });
            return of(null);
          })
        ).subscribe((response) => {
          if (response) {
            product.quantity -= 1;
            this.cartService.updateCartItemCount();
            console.log('Item added to cart:', response);
            customSwal.fire({
              title: "เพิ่มสินค้าเรียบร้อย",
              icon: "success",
              confirmButtonText: "ตกลง",
              confirmButtonColor: "#28a745",
            });
          }
        });
      } else {
        customSwal.fire({
          title: "สินค้าหมดแล้ว",
          confirmButtonText: "ตกลง",
          icon: "warning",
          confirmButtonColor: "#F36523",
        });
      }
    }

  goToDetails(item: any) {
    this.router.navigate(['/details', item.id]);
  }
}
