import { Injectable } from '@angular/core';
import { Product } from '../../interfaces/products/products.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsService {

  apiUrl = "http://localhost:5000/api"

  constructor(private http: HttpClient) { }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/product/${id}`)
  }

}
