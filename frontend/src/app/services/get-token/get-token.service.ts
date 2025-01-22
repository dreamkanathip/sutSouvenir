import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetTokenService {

  constructor() { }
  token: any = this.getAuthHeaders()

  private getAuthHeaders(): HttpHeaders {
      const token = localStorage.getItem('jwt'); // ดึง token จาก localStorage
      return new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '', // ใส่ token ใน header ถ้ามี
      });
    }
  
  getToken() {
    return this.getAuthHeaders()
  }
}
