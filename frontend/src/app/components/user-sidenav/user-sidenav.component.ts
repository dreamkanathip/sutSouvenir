import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserModel } from '../../interfaces/user/user.model';

@Component({
  selector: 'app-user-sidenav',
  templateUrl: './user-sidenav.component.html',
  styleUrl: './user-sidenav.component.css'
})
export class UserSidenavComponent {

  user?: UserModel;

  userStoragePage: Number = 0

  private subscription: Subscription = new Subscription();

  constructor(private userService: UserService, private router: Router) {}
  
  ngOnInit(): void {
    this.getUserData();

    this.subscription.add(
      this.userService.storagePage$.subscribe((page) => {
        this.userStoragePage = page;
      })
    );
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

  showFullName(): string {
    if (this.user?.firstName && this.user?.lastName) {
      return `${this.user.firstName} ${this.user.lastName}`;
    }
    return "ไม่พบชื่อในระบบ";
  }

  openPages(page: Number){
    this.userService.setStoragePage(page);
  }

}
