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

  onSearchInput() {
    if (this.searchTerm.trim() === '') {
      this.searchResults = []; // ล้างผลลัพธ์การค้นหาเมื่อไม่มีคำค้นหา
      return;
    }
  
    const term = this.searchTerm.toLowerCase();
  
    this.searchResults = this.products.filter((product) => {
      const productName = product.title.toLowerCase();
      // ตรวจสอบว่าชื่อสินค้าตรงหรือคล้ายกับคำค้นหา
      return productName.includes(term) || this.isSimilar(productName, term);
    });
  }
  
  // ฟังก์ชันตรวจสอบความคล้ายคลึงของข้อความ (Fuzzy Search)
  isSimilar(str1: string, str2: string): boolean {
    const levenshteinDistance = this.calculateLevenshteinDistance(str1, str2);
    const similarityThreshold = Math.ceil(str2.length * 0.4); // ยอมรับความคล้ายคลึง 40%
    return levenshteinDistance <= similarityThreshold;
  }
  
  // คำนวณ Levenshtein Distance
  calculateLevenshteinDistance(a: string, b: string): number {
    const dp = Array.from({ length: a.length + 1 }, () =>
      Array(b.length + 1).fill(0)
    );
  
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + cost // substitution
        );
      }
    }
  
    return dp[a.length][b.length];
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

  goToDetails(item: any) {
    this.router.navigate(['/details', item.id]);
  }
}
