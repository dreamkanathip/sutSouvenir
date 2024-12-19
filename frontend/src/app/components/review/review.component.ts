import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { ReviewService } from '../../services/review/review.service';
import { UserModel } from '../../interfaces/user/user.model';
import { Product } from '../../interfaces/products/products.model';
import { ReviewModel } from '../../interfaces/review/review.model';
import { ProductDetailsService } from '../../services/product-details/product-details.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent implements OnInit {

  user?: UserModel

  review?: ReviewModel

  product?: Product

  rating: number = 0; // คะแนนที่ผู้ใช้เลือก
  stars: number[] = [0, 1, 2, 3, 4]; // ดาวทั้งหมด (5 ดาว)

  comment?: string

  constructor (
    private route: ActivatedRoute,
    private userService: UserService, 
    private reviewService: ReviewService,
    private productService: ProductDetailsService,
  ) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const productIdFromRoute = Number(routeParams.get('id'));
    this.getUserData()
    this.getProductData(productIdFromRoute)
    this.getReviewData()
    console.log(this.product)
  }

  getUserData() {
      this.userService.getUserData().subscribe({
        next: (result: UserModel) => {
          if (result) {
            this.user = result
          }
        },
        error: (err) => {
          console.error('Error fetching user data', err);
        }
      });
  }

  getProductData(id: number){
    this.productService.getProductById(id).subscribe({
      next: (result) => {
        this.product = result
      },
      error: (err) => {
        console.log('Error Fetching Product Data', err);
      }
    })
  }

  getReviewData() {
    this.reviewService.getReview(1, 1).subscribe({
      next: (result: ReviewModel) => {
        this.review = result
      },
      error: (err) => {
        console.log('Error fetching review data', err);
      }
    })

    //
    // const editedReview = this.reviewService.getEditedReview()
    // if (editedReview) {
    //   this.review = editedReview
    // }
  }

  setRating(rating: number) {
    this.rating = rating;
  }

}
