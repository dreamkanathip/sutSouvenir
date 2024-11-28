import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductManagementService } from './../../services/product-management/product-management.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent implements OnInit {
  // Define form structure with initial values
  form = {
    title: '',
    quantity: 1,
    price: 0.01,
    description: '',
  };

  constructor(
    private router: Router,
    private productManagementService: ProductManagementService
  ) {}

  ngOnInit(): void {}

  // Submit function to handle form submission
  submit(): void {
    // Check if the form is invalid

    // Show confirmation dialog before saving
    Swal.fire({
      title: 'Do you want to save the changes?',
      showCancelButton: true,
      confirmButtonText: 'Save',
      icon: 'warning',
    }).then((result) => {
      if (result.isConfirmed) {
        // Call service to save the product
        this.productManagementService.addProduct(this.form).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Product has been saved!',
              showConfirmButton: true,
            }).then(() => {
              // Reset form on success
              this.resetForm();
            });
          },
          (error) => {
            console.error('Error saving product:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to save the product!',
              showConfirmButton: true,
            });
          }
        );
      }
    });
  }

  // Check if the form is valid

  // Reset form after successful submission
  resetForm(): void {
    this.form = {
      title: 'sda',
      quantity: 1,
      price: 0.01,
      description: 'asdsad',
    };
  }
}
