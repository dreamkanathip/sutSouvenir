import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // แก้ไขจาก styleUrl เป็น styleUrls
})
export class AppComponent implements OnInit {
  title = 'frontend';
  isRegisterPage = false;
  isLoginPage = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Subscribe to router events to determine if the current route is the register page
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isRegisterPage = this.router.url === '/register';
        this.isLoginPage = this.router.url === '/login';
      }
    });
  }
}
