import { Component } from '@angular/core';
import { Emitters } from '../../emitters/emitter';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { CartService } from '../../services/cart/cart.service';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { Product } from '../../interfaces/products/products.model';
import { UserModel } from '../../interfaces/user/user.model';
import { HomepageService } from '../../services/homepage/homepage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {

  cartItemCount: number = 0;
  userId: number = 1

  user?: UserModel

  products: Product[] = []
  searchTerm: string = ""
  searchResults: Product[] = [];

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private cartService: CartService,
    private homepageService: HomepageService,
    private userService: UserService,
    private router: Router
  ) {
    if (typeof window !== 'undefined') {
      this.cartService.updateCartItemCount(this.userId)
      this.cartService.cartItemCount$.subscribe((count) => {
      this.cartItemCount = count
    })
    }
    
  }
  ngOnInit(): void {
    this.getUserData();
    this.loadProducts();
  }

  logout(): void {
    this.authService.logout();
  }

  loadProducts() {
    this.homepageService.getAllProducts().subscribe((result) => {
      this.products = result;
    });
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

  getImageUrl(item: Product): string {
    if (item.images && item.images.length > 0) {
      return String(item.images[0].url) + String(item.images[0].asset_id);
    }
    return 'assets/SUT-Logo.png';
  }

  onSearchInput() {
    // ล้างผลลัพธ์การค้นหาเมื่อไม่มีคำค้นหา
    if (this.searchTerm.trim() === '') {
      this.searchResults = [];
      return;
    }
  
    const term = this.searchTerm.toLowerCase();
  
    // กรองสินค้าตามคำค้นหา
    this.searchResults = this.products.filter((product) =>
      product.title.toLowerCase().includes(term)
    );
  }

  NavigateToSearch(){
    console.log("Result:", this.searchResults)
  }

  NavigateToStorage(){
    this.userService.setStoragePage(0)
    this.router.navigate(['/user/storage']);
  }

  NavigateToHistory(){
    this.userService.setStoragePage(1)
    this.router.navigate(['/user/storage']);
  }

  NavigateToFavourite(){
    this.userService.setStoragePage(2)
    this.router.navigate(['/user/storage'])
  }

  NavigateToProfile(){
    this.userService.setStoragePage(3)
    this.router.navigate(['/user/storage'])
  }

  goToDetails(item: any) {
    this.router.navigate(['/details', item.id]);
  }

  searchItem() {
    this.homepageService.setSearchWord(this.searchTerm);
    this.router.navigate(['/home']);
  }
}
