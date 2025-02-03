import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { UserModel } from '../../interfaces/user/user.model';
import { userOrder } from '../../interfaces/order/order';
import { BehaviorSubject } from 'rxjs';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api'; // เปลี่ยน URL ให้ตรงกับ backend ของคุณ

  private storagePageSubject = new BehaviorSubject<Number>(3);
  storagePage$ = this.storagePageSubject.asObservable();

  // 0 = Storage
  // 1 = History
  // 2 = Favourite
  // 3 = User Profile
  // 4 = Address
  // 5 = Add address
  // 6 = Edit address

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  getItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getItem('jwt');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '', // ใส่ token ใน header ถ้ามี
    });
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.apiUrl}/superadmin/users`, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    });
  }
  // ฟังก์ชันดึงข้อมูลโปรไฟล์ของผู้ใช้
  getUserData(): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/user/profile`, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    });
  }
  // ฟังห์ชันลบผู้ใช้
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/superadmin/users/${userId}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    });
  }

  // ฟังก์ชันอัปเดตข้อมูลผู้ใช้
  updateUser(user: UserModel): Observable<UserModel> {
    return this.http.put<UserModel>(`${this.apiUrl}/user/update`, user, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    });
  }

  // ฟังก์ชันอัปเดตรหัสผ่านของผู้ใช้
  updateUserPassword(password: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/user/password`, password, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    });
  }

  // ฟังก์ชันดึงข้อมูลการเก็บของของผู้ใช้
  getUserStorage(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/user/storage`, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    });
  }

  setStoragePage(page: Number) {
    this.storagePageSubject.next(page);
  }

  getStoragePage() {
    return this.storagePageSubject.value;
  }
}
