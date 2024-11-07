import { Injectable } from '@angular/core';
import { Product } from '../../interfaces/products/products.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomepageService {

  apiUrl = "http://localhost:5000/api"

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`)
  }
  getProductById(id: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/${id}`)
  }
}
