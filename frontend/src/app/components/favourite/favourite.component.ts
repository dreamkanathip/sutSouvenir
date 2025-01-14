import { Component, OnInit } from '@angular/core';
import { FavouriteService } from '../../services/favourite/favourite.service'; // นำเข้า FavouriteService
import { Product } from '../../interfaces/products/products.model'; // นำเข้า interface Product

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.css'],
})
export class FavouriteComponent implements OnInit {
//   likedProducts!: Product[]; // รายการสินค้าที่ถูกกดถูกใจ
//   userId: number = 1; // ใช้ userId ที่ต้องการ (สามารถดึงจากการเข้าสู่ระบบ)

  constructor(private favouriteService: FavouriteService) {}

  ngOnInit(): void {
    // this.loadLikedProducts(); // โหลดรายการสินค้าที่ถูกกดถูกใจเมื่อ component ถูกสร้าง
  }

//   // ฟังก์ชันเพื่อโหลดสินค้าที่ถูกกดถูกใจ
//   loadLikedProducts(): void {
//     this.favouriteService.getLikedProducts(this.userId).subscribe(
//       (data) => {
//         this.likedProducts = data; // เก็บข้อมูลสินค้าที่ถูกกดถูกใจใน likedProducts
//         console.log('Liked Products:', this.likedProducts);
//       },
//       (error) => {
//         console.error('Error loading liked products', error); // แสดงข้อผิดพลาดถ้ามี
//       }
//     );
//   }

//   // ฟังก์ชันลบรายการออกจากรายการโปรด
//   removeFromFavourites(productId: number): void {
//     this.favouriteService
//       .removeFromFavourites(this.userId, productId)
//       .subscribe(
//         () => {
//           this.loadLikedProducts(); // รีเฟรชรายการโปรด
//         },
//         (error) => {
//           console.error('Error removing from favourites', error); // แสดงข้อผิดพลาดถ้ามี
//         }
//       );
//   }
// }
}