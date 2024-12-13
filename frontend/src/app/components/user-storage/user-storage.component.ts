import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../interfaces/user/user.model';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-user-storage',
  templateUrl: './user-storage.component.html',
  styleUrls: ['./user-storage.component.css']
})
export class UserStorageComponent implements OnInit {

  user?: UserModel;
  order: any[] = []
  storage: any[] = [];

  storageOpen: boolean = false

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUserData();
    this.getUserStorageItem();
  }

  getUserData() {
    this.userService.getUserData().subscribe({
      next: (result: UserModel) => {
        if (result) {
          this.user = result;
        }
      },
      error: (err) => {
        console.error('Error fetching user data', err);
      }
    });
  }

  getUserStorageItem() {
    this.userService.getUserStorage().subscribe({
      next: (items) => {
        let orders = items.orders;  // ดึงข้อมูล orders
      if (orders) {
        orders.forEach((order: any) => {
          if (order.products) {
            // product ภายใน order
            order.products.forEach((productOnOrder: any) => {
              const product = productOnOrder.product;
              // ตรวจสอบว่า product ซ้ำหรือไม่
              const isProductExists = this.storage.some(existingProduct => existingProduct.id === product.id);

              // ถ้า product ยังไม่อยู่ใน storage ก็เพิ่ม
              if (!isProductExists) {
                this.storage.push(product);  // เพิ่ม product ใน storage
              }
            });
          }
        })
      };
      },
      error: (err) => {
        console.error('Error fetching user storage items', err);
      }
    });
  }

  openStorage(){
    this.storageOpen = true
  }

  openHistory() {
    this.storageOpen = false
  }
}
