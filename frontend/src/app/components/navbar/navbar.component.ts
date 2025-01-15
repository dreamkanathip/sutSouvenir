import { Component } from '@angular/core';
import { Emitters } from '../../emitters/emitter';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { CartService } from '../../services/cart/cart.service';
import { Observable } from 'rxjs';

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
  ) {
    if (typeof window !== 'undefined') {
      this.cartService.updateCartItemCount(this.userId)
      this.cartService.cartItemCount$.subscribe((count) => {
      this.cartItemCount = count
    })
    }
    
  }
  ngOnInit(): void {
  }
  logout(): void {
    this.authService.logout();
  }
}
