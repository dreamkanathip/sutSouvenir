import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../../interfaces/user/user.model';
import { userOrder } from '../../interfaces/order/order';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = "http://localhost:5000/api";

  private storagePageSubject = new BehaviorSubject<Number>(0);
  storagePage$ = this.storagePageSubject.asObservable();

  // 0 = Storage 
  // 1 = History
  // 2 = Favourite

  constructor(private http: HttpClient) { }

  getUserData(): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/user/profile`, { withCredentials: true });
  }

  updateUser(user: UserModel): Observable<UserModel> {
    return this.http.put<UserModel>(`${this.apiUrl}/user/update`, user);
  }

  updateUserPassword(password: any) : Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/user/password`, password, { withCredentials: true });
  }

  getUserStorage(): Observable<userOrder> {
    return this.http.get<any>(`${this.apiUrl}/user/storage`)
  }
  
  setStoragePage(page: Number){
    this.storagePageSubject.next(page);
  }

  getStoragePage() {
    return this.storagePageSubject.value;
  }
}
