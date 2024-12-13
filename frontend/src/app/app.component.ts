import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser'; // นำเข้า Title service

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // ใช้ชื่อ styleUrls ที่ถูกต้อง
})
export class AppComponent implements OnInit {
  title = 'SUTSouvenir'; // Title เริ่มต้น
  isRegisterPage = false;
  isLoginPage = false;

  constructor(private router: Router, private titleService: Title) {}

  ngOnInit() {
    // กำหนด Title เริ่มต้น
    this.titleService.setTitle(this.title);

    // Subscribe to router events
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // ตรวจสอบ URL เพื่อกำหนดค่า isRegisterPage และ isLoginPage
        this.isRegisterPage = this.router.url === '/register';
        this.isLoginPage = this.router.url === '/login';

        // เปลี่ยน Title ตามหน้าที่เข้าไป
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
