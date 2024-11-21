import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStatusSubject = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatusSubject.asObservable();

  private isBrowser: boolean;
  apiUrl = 'http://localhost:5000/api';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.checkAuthentication();
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        // No need to store the token in localStorage; it will be in an HTTP-only cookie
        this.authStatusSubject.next(true); // Set the authenticated status
      })
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/check-auth`, {}).subscribe(() => {
      this.authStatusSubject.next(false); // Update the authentication status
    });
  }

  checkAuthentication(): void {
    this.http
      .get<any>(`${this.apiUrl}/check-auth`, { withCredentials: true })
      .subscribe(
        (response) => {
          this.authStatusSubject.next(true);
        },
        (error) => {
          this.authStatusSubject.next(false);
        }
      );
  }

  isAuthenticated(): boolean {
    this.checkAuthentication();
    return this.authStatusSubject.getValue();
  }
}
