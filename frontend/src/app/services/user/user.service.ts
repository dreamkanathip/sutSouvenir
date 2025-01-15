import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { UserModel } from '../../interfaces/user/user.model';
import { userOrder } from '../../interfaces/order/order';
import { Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api'; // เปลี่ยน URL ให้ตรงกับ backend ของคุณ

  constructor(private http: HttpClient) {}

  // ฟังก์ชันสร้าง headers พร้อม Authorization
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt'); // ดึง token จาก localStorage
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '', // ใส่ token ใน header ถ้ามี
    });
  }

  getAllUsers(): Observable<UserModel[]> {
    const token = localStorage.getItem('jwt');

    if (!token) {
      throw new Error('No token found. Please log in again.');
    }

    return this.http.get<UserModel[]>(`${this.apiUrl}/superadmin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
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
}
