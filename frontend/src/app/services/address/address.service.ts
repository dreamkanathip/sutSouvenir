import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddressModel } from '../../interfaces/address/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  apiUrl = "http://localhost:5000/api"

  editAddress: any

  constructor(private http: HttpClient) { }

  getAllAddress(uid: number): Observable<AddressModel[]> {
    return this.http.get<AddressModel[]>(`${this.apiUrl}/listAddress/${uid}`)
  }

  getAddress(id: number): Observable<AddressModel> {
    return this.http.get<AddressModel>(`${this.apiUrl}/address/${id}`);
  }


  createAddress(address: any, uid: number): Observable<AddressModel[]> {
    return this.http.post<AddressModel[]>(`${this.apiUrl}/address/${uid}`, address)
  }

  selectedEditAddress(id: number) {
    this.editAddress = id
  }
  
  getEditAddressId() {
    return this.editAddress
  }

  fetchThaiData() {
    return this.http.get<any[]>(`https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json`)
  }
}
