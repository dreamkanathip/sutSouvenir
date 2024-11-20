import { Component } from '@angular/core';
import { Emitters } from '../../emitters/emitter';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  authenticated = false;
  constructor(private http: HttpClient, private authService: AuthService) {}
  ngOnInit(): void {
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;
    });
    this.authService.authStatus$.subscribe((status) => {
      this.authenticated = status;
    });
  }
  logout(): void {
    this.http
      .post('http://localhost:5000/api/logout', {}, { withCredentials: true })
      .subscribe(() => (this.authenticated = false));
    this.authService.logout();
  }
}
