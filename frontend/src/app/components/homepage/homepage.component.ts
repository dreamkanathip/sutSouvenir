import { Component } from '@angular/core';
import { HomepageService } from '../../services/homepage/homepage.service';
import { Product } from '../../interfaces/products/products.model';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { CartService } from '../../services/cart/cart.service';
import { catchError, firstValueFrom, of, switchMap, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { ReviewService } from '../../services/review/review.service';
import { FavouriteService } from '../../services/favourite/favourite.service';
import { FavouriteResponse } from '../../interfaces/favourite/favourite.model';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../interfaces/category/category.model';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  addToFav!: any;
  productItems: Product[] = [];
  userId: number = 1;

  productRating!: any[]

  favouriteList?: FavouriteResponse[]
  favourites: Product[] = []

  searchTerm: string = ""

  categories: Category[] = []

  sortCategory: string = ""
  sortPrice: boolean = true

  productShow!: Product[];

  private subscription: Subscription = new Subscription();


  constructor(
    private homepageService: HomepageService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private reviewService: ReviewService,
    private favouriteService: FavouriteService,
    private router: Router
  ) {
    this.loadProducts();
    this.loadCategory();
    this.loadRatings();
    this.loadFavourite();

    this.subscription.add(
      this.homepageService.SearchTerm$.subscribe((word) => {
        this.searchTerm = word;
        this.filterProducts();
      })
    );
  }

  loadProducts() {
    this.homepageService.getAllProducts().subscribe((result) => {
      this.productItems = result || [];
      this.filterProducts();
    });
  }

  loadCategory() {
    this.categoryService.getCategories().subscribe((result) => {
      this.categories = result
    })
  }

  loadRatings() {
    this.reviewService.listRating().subscribe((result) => {
      this.productRating = result
    })
  }

  loadFavourite(){
    this.favourites = []
    this.favouriteService.getLikedProducts().subscribe((result) => {
      this.favouriteList = result
      if (this.favouriteList) {
        this.favouriteList.forEach(list => {
          this.favourites.push(list.product)
        })
      }
    })
  }

  checkFavourite(item: Product){
    let check = this.favourites?.some(product => product.id == item.id)
    if (check) {
      return false
    } else {
      return true
    }
  }

  getProductRating(productId: number): number {
    if (!this.productRating || this.productRating.length === 0) {
      return 0;
    }
  
    const ratingData = this.productRating.find((item) => item.id === productId);
    return ratingData ? ratingData.averageRating : 0;
  }

  roundRating(rating: number): number {
    return Math.floor(rating);
  }
  
  isHalfStar(rating: number, index: number): boolean {
    return index === Math.floor(rating) && rating % 1 >= 0.5;
  }
  
  fullStars(rating: number, index: number): boolean {
    return index < Math.floor(rating);
  }
  
  emptyStars(rating: number, index: number): boolean {
    return index >= Math.ceil(rating);
  }

  onSearchInput() {
    this.filterProducts();
  }
  
  onCategoryChange(category: string) {
    this.sortCategory = category;
    this.filterProducts();
  }
  
  onSortChange(price: boolean) {
    this.sortPrice = price; // true = ราคาน้อยไปมาก, false = ราคามากไปน้อย
    this.filterProducts();
  }
  

  filterProducts() {
    let filteredProducts = [...this.productItems];
  
    // กรองสินค้าตามคำค้นหา
    if (this.searchTerm.trim() !== '') {
      filteredProducts = filteredProducts.filter((item) =>
        item.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  
    // กรองสินค้าตามหมวดหมู่
    if (this.sortCategory && this.sortCategory !== '') {
      filteredProducts = filteredProducts.filter((item) =>
        item.category.name === this.sortCategory
      );
    }
  
    // เรียงสินค้าตามราคา
    if (this.sortPrice) {
      filteredProducts = filteredProducts.sort((a, b) => a.price - b.price); // น้อยไปมาก
    } else {
      filteredProducts = filteredProducts.sort((a, b) => b.price - a.price); // มากไปน้อย
    }
  
    this.productShow = filteredProducts;
  }
  
  
  addItemToCart(item: Product) {
    const data = {
      userId: this.userId,
      productId: item.id,
      quantity: '1',
    };

    const product = this.productItems.find((i) => i.id === item.id);
    if (product && product.quantity > 0) {
      this.cartService.getCartById(this.userId).pipe(
        switchMap((checkCart) => {
          if (!checkCart) {
            // Initialize cart if not available
            return this.cartService.initialCart({ userId: this.userId, cartTotal: 0 }).pipe(
              switchMap(() => this.cartService.addItemToCart(data))
            );
          }
          return this.cartService.addItemToCart(data)
        }),
        catchError((err) => {
          console.error('Error during add to cart:', err);
          Swal.fire({
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
          this.cartService.updateCartItemCount(this.userId);
          console.log('Item added to cart:', response);
          const customSwal = Swal.mixin({
                    customClass: {
                      popup: "title-swal",
                    },
                  });
          customSwal.fire({
            title: "เพิ่มสินค้าเรียบร้อย",
            icon: "success",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#28a745",
          });
        }
      });
    } else {
      Swal.fire({
        title: "สินค้าหมดแล้ว",
        confirmButtonText: "ตกลง",
        icon: "warning",
        confirmButtonColor: "#F36523",
      });
    }
  }

  getImageUrl(item: Product): string {
    if (item.images && item.images.length > 0) {
      return String(item.images[0].url) + String(item.images[0].asset_id);
    }
    return 'assets/SUT-Logo.png';
  }

  likeProduct(item: any) {
    this.favouriteService.likeProduct(item).subscribe((result) => {
      this.loadFavourite()
    })
  }

  unlikeProduct(item: any) {
    this.favouriteService.removeFromFavourites(item.id).subscribe((result) => {
      this.loadFavourite()
    })
  }

  goToDetails(item: any) {
    this.router.navigate(['/details', item.id]);
  }
}

