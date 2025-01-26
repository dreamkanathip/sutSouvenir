import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReviewModel, ReviewResponse } from '../../interfaces/review/review.model';
import { GetTokenService } from '../get-token/get-token.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient, private getTokenService: GetTokenService) {
    this.getUserReview()
  }

  apiUrl = "http://localhost:5000/api"

  editedReview: any

  private getAuthHeaders(): HttpHeaders {
      const token = window.localStorage.getItem('jwt'); // ดึง token จาก localStorage
      return new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '', // ใส่ token ใน header ถ้ามี
      });
  }

  listReview(pid: number): Observable<ReviewResponse> {
    return this.http.get<any>(`${this.apiUrl}/review/${pid}`)
  }

  getUserReview(): Observable<ReviewModel[]> {
    return this.http.get<ReviewModel[]>(`${this.apiUrl}/userReview/`, {
      headers: this.getTokenService.getToken(),
      withCredentials: true, // ส่งคุกกี้
    }) 
  }

  createReview(pid: number, review: any): Observable<ReviewModel> {
    return this.http.post<ReviewModel>(`${this.apiUrl}/review/${pid}`, review, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    }) 
  }

  updateReview(pid: number, uid: number, review: any): Observable<ReviewModel> {
    return this.http.put<ReviewModel>(`${this.apiUrl}/review/${pid}/${uid}`, review, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // ส่งคุกกี้
    }) 
  }

  deleteReview(rid: number): Observable<ReviewModel> {
    return this.http.delete<ReviewModel>(`${this.apiUrl}/review/${rid}`, );
  }

  listRating(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productRating`)
  }

  getEditedReview(){
    return this.editedReview
  }

}
