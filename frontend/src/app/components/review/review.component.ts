import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { ReviewService } from '../../services/review/review.service';
import { UserModel } from '../../interfaces/user/user.model';
import { Product } from '../../interfaces/products/products.model';
import { ReviewModel } from '../../interfaces/review/review.model';
import { ProductDetailsService } from '../../services/product-details/product-details.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent implements OnInit {

  user: UserModel = { id: 0 }; 

  review?: ReviewModel

  product?: Product

  productId: number = 0

  editStatus: boolean = false
  editReview: number = 0

  rating: number = 0; // คะแนนที่ผู้ใช้เลือก
  stars: number[] = [0, 1, 2, 3, 4]; // ดาวทั้งหมด (5 ดาว)

  comment?: string = ""

  constructor (
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService, 
    private reviewService: ReviewService,
    private productService: ProductDetailsService,
  ) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.productId = Number(routeParams.get('id'));
    this.getUserData()
    this.getProductData(this.productId)
    // this.getReviewData()
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

  // getReviewData() {
  //   this.reviewService.getReview(this.productId, this.user.id).subscribe({
  //     next: (result: ReviewModel) => {
  //       this.review = result
  //       this.rating = result.star
  //       this.comment = result.comment
  //       this.editStatus = true
  //       this.editReview = result.id
  //     },
  //     error: (err) => {
  //       console.log('Error fetching review data', err);
  //     }
  //   })

  //   //
  //   // const editedReview = this.reviewService.getEditedReview()
  //   // if (editedReview) {
  //   //   this.review = editedReview
  //   // }
  // }

  setRating(rating: number) {
    this.rating = rating;
  }

  formReset(){
    this.rating = 0
    this.comment = ""
  }

  onSubmit() {
    if (this.user?.id && this.productId) { // ตรวจสอบว่า userId และ productId มีค่า
      this.review = {
        id: this.editReview,
        star: this.rating,
        comment: this.comment,
        userId: this.user.id,
        productId: this.productId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
        Swal.fire({
          title: "ต้องการบันทึกรีวิวหรือไม่?",
          text: "รีวิวเก่าของคุณจะยังคงอยู่และสามารถมองเห็นได้โดยผู้อื่น",
          showCancelButton: true,
          confirmButtonText: "บันทึก",
          cancelButtonText: "ยกเลิก",
          icon: "warning",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "กำลังบันทึกข้อมูล...",
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });
            this.reviewService
              .createReview(this.productId, this.review)
              .subscribe({
                next: () => {
                  Swal.fire({
                    title: "บันทึกรีวิวเรียบร้อยแล้ว",
                    showCancelButton: true,
                    confirmButtonText: "ตกลง",
                    cancelButtonText: "ยกเลิก",
                    icon: "success",
                  });
                  this.formReset()
                  this.router.navigate(['/details', this.productId]);
                },
                error: (err) => {
                  Swal.fire("ขออภัยครับ/ค่ะ ไม่สามารถบันทึกรีวิวได้ในขณะนี้");
                  console.error("Error creating review:", err);
                },
              });
          }
        });
    } else {
      Swal.fire({
        title: "ขออภัย เกิดข้อผิดพลาด",
        allowOutsideClick: true,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      console.warn("User ID หรือ Product ID ไม่พร้อมใช้งาน");
    }
  }
  
}
