import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddressModel } from '../../interfaces/address/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  apiUrl = "http://localhost:5000/api"

  editAddress: any

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
      const token = localStorage.getItem('jwt'); // ดึง token จาก localStorage
      return new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '', // ใส่ token ใน header ถ้ามี
      });
    }
    
  getAllAddress(uid: number): Observable<AddressModel[]> {
    return this.http.get<AddressModel[]>(`${this.apiUrl}/listAddress/${uid}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    })
  }

  getAddress(id: number): Observable<AddressModel> {
    return this.http.get<AddressModel>(`${this.apiUrl}/address/${id}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    });
  }

  getDefaultAddress(uid: number): Observable<AddressModel> {
    return this.http.get<AddressModel>(`${this.apiUrl}/defaultAddress`, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    });
  }

  createAddress(address: any, uid: number): Observable<AddressModel[]> {
    return this.http.post<AddressModel[]>(`${this.apiUrl}/address/${uid}`, address, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    })
  }

  updateAddress(address: any, uid: number, id: number): Observable<AddressModel[]> {
    return this.http.put<AddressModel[]>(`${this.apiUrl}/address/${uid}/${id}`, address, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    });
  }

  deleteAddress(id: number): Observable<AddressModel> {
    return this.http.delete<AddressModel>(`${this.apiUrl}/address/${id}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    });
  }

  selectedEditAddress(id: number) {
    this.editAddress = id
  }
  
  getEditAddressId() {
    return this.editAddress
  }

  setDefaultAddress(id: number, status: boolean){
    return this.http.patch(`${this.apiUrl}/address/default/${id}`, { default: status }, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    })
  }

  fetchThaiData() {
    return this.http.get<any[]>(`https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json`)
  }
}
