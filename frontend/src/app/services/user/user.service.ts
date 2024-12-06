import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../../interfaces/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = "http://localhost:5000/api";

  constructor(private http: HttpClient) { }

  getUserData(): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/user/profile`, { withCredentials: true });
  }
}
