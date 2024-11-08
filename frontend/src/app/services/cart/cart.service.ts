import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }

  apiUrl = 'http://localhost:5000/api';

  addItemToCart(data: any): Observable<any>{
    console.log(data)
    return this.http.post<any>('http://localhost:5000/api/addToCart', data)
  }
}
