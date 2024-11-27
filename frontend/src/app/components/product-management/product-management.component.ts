import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductManagementService } from './../../services/product-management/product-management.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  selectedFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private productManagementService: ProductManagementService
  ) {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  // Accessor methods for form controls
  get title() {
    return this.form.get('title');
  }
  get quantity() {
    return this.form.get('quantity');
  }
  get price() {
    return this.form.get('price');
  }
  get description() {
    return this.form.get('description');
  }

  ngOnInit(): void {
    // Initialization logic if needed
  }

  // Submit function to handle form submission
  submit() {
    this.submitted = true; // Track that the form has been submitted
    if (this.form.invalid) {
      console.log('Form is invalid');
      return; // If form is invalid, stop submission
    }

    // Create FormData for product submission
    const formData = new FormData();
    formData.append('title', this.form.get('title')?.value ?? '');
    formData.append('quantity', this.form.get('quantity')?.value ?? '');
    formData.append('price', this.form.get('price')?.value ?? '');
    formData.append('description', this.form.get('description')?.value ?? '');

    // Log the form data to console
    console.log('Form Data:', {
      title: this.form.get('title')?.value,
      quantity: this.form.get('quantity')?.value,
      price: this.form.get('price')?.value,
      description: this.form.get('description')?.value,
    });

    // Show confirmation dialog before saving
    Swal.fire({
      title: 'Do you want to save the changes?',
      showCancelButton: true,
      confirmButtonText: 'Save',
      icon: 'warning',
    }).then((result) => {
      if (result.isConfirmed) {
        // Call service to save the product
        this.productManagementService.addProduct(formData).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Product has been saved!',
              showConfirmButton: true,
            });
            // Navigate to favorite page after successful save
            this.router.navigate(['/favorite']);
          },
          (error) => {
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
}
