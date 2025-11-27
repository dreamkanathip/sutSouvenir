import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'SUTSouvenir'; // Title เริ่มต้น
  isRegisterPage = false;
  isLoginPage = false;

  constructor(private router: Router, private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isRegisterPage = this.router.url === '/register';
        this.isLoginPage = this.router.url === '/login';
        if (this.isRegisterPage) {
          this.titleService.setTitle('SUTSouvenir');
        } else if (this.isLoginPage) {
          this.titleService.setTitle('SUTSouvenir');
        } else {
          this.titleService.setTitle(this.title);
        }
      }
    });
  }
}
