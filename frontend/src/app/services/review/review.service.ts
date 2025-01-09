import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReviewModel, ReviewResponse } from '../../interfaces/review/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) { }

  apiUrl = "http://localhost:5000/api"

  editedReview: any

  listReview(pid: number): Observable<ReviewResponse> {
    return this.http.get<any>(`${this.apiUrl}/review/${pid}`)
  }

  getUserReview(): Observable<ReviewModel[]> {
    return this.http.get<ReviewModel[]>(`${this.apiUrl}/userReview/`) 
  }

  createReview(pid: number, uid: number, review: any): Observable<ReviewModel> {
    return this.http.post<ReviewModel>(`${this.apiUrl}/review/${pid}/${uid}`, review) 
  }

  updateReview(pid: number, uid: number, review: any): Observable<ReviewModel> {
    return this.http.put<ReviewModel>(`${this.apiUrl}/review/${pid}/${uid}`, review) 
  }

  deleteReview(rid: number): Observable<ReviewModel> {
    return this.http.delete<ReviewModel>(`${this.apiUrl}/review/${rid}`);
  }

  listRating(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productRating`)
  }

  getEditedReview(){
    return this.editedReview
  }

}
