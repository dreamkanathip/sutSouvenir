import { Component } from '@angular/core';
import { Emitters } from '../../emitters/emitter';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { CartService } from '../../services/cart/cart.service';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {

  cartItemCount: number = 0;
  userId: number = 1

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private cartService: CartService,
    private userService: UserService,
    private router: Router
  ) {

    this.cartService.updateCartItemCount(this.userId)
    this.cartService.cartItemCount$.subscribe((count) => {
      this.cartItemCount = count
    })
  }
  ngOnInit(): void {
  }
  logout(): void {
    this.authService.logout();
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
}
