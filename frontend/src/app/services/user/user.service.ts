import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { UserModel } from '../../interfaces/user/user.model';
import { Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = "http://localhost:5000/api";

  constructor(private http: HttpClient) { }
  getUserData(): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/user/profile`, { withCredentials: true });
  }

  updateUser(user: UserModel): Observable<UserModel> {
    return this.http.put<UserModel>(`${this.apiUrl}/user/update`, user, { withCredentials: true });
  }

  updateUserPassword(password: any) : Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/user/password`, password, { withCredentials: true });
  }

  getUserStorage(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/user/storage`)
  }
}
