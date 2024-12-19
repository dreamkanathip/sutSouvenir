import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReviewModel } from '../../interfaces/review/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) { }

  apiUrl = "http://localhost:5000/api"

  editedReview: any

  listReview(pid: number): Observable<ReviewModel[]> {
    return this.http.get<ReviewModel[]>(`${this.apiUrl}/review/${pid}`)
  }

  getReview(pid: number, uid: number): Observable<ReviewModel> {
    return this.http.get<ReviewModel>(`${this.apiUrl}/review/${pid}/${uid}`) 
  }

  createReview(pid: number, uid: number, review: any): Observable<ReviewModel> {
    return this.http.post<ReviewModel>(`${this.apiUrl}/review/${pid}/${uid}`, review) 
  }

  updateReview(pid: number, uid: number, review: any): Observable<ReviewModel> {
    return this.http.put<ReviewModel>(`${this.apiUrl}/review/${pid}/${uid}`, review) 
  }

  deleteAddress(rid: number): Observable<ReviewModel> {
    return this.http.delete<ReviewModel>(`${this.apiUrl}/review/${rid}`);
  }

  getEditedReview(){
    return this.editedReview
  }

}
