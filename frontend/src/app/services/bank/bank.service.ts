import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  apiUrl = "http://localhost:5000/api"

  constructor(private http: HttpClient) {
   }

   getDestBank() {
    return this.http.get<any>(`${this.apiUrl}/destBank`)
   }
   getOriginBank() {
    return this.http.get<any>(`${this.apiUrl}/originBank`)
   }
   addDestBank(data: any) {
    return this.http.post<any>(`${this.apiUrl}/destBank`, data)
   }
   addOriginBank(data: any) {
    return this.http.post<any>(`${this.apiUrl}/originBank`, data)
   }
   updateDestBank(id: number) {
    return this.http.get<any>(`${this.apiUrl}/destBank/${id}`)
   }
   updateOriginBank(id: number) {
    return this.http.get<any>(`${this.apiUrl}/originBank/${id}`)
   }
  deleteDestBank(id: number) {
    return this.http.get<any>(`${this.apiUrl}/destBank/${id}`)
   }
   deleteOriginBank(id: number) {
    return this.http.get<any>(`${this.apiUrl}/originBank/${id}`)
   }
}
