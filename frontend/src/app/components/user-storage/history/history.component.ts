import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit{

  order: any[] = []
  storage: any[] = [];

  historyModal: boolean = false
  selectedHistory?: number
  selectedHistoryDetail? : any // ProductsOnOrder
  selectedHistoryProducts? : any[] // รายการสินค้า

  constructor(private userService: UserService){}

  ngOnInit(): void {
    this.getUserStorageItem();
  }

  getUserStorageItem() {
    this.userService.getUserStorage().subscribe({
      next: (items) => {
        this.order = items.orders;  // ดึงข้อมูล orders
      if (this.order) {
        this.order.forEach((order: any) => {
          if (order.products) {

            // เรียง orders จาก createdAt
            this.order.sort((a: any, b: any) => {
              const dateA = new Date(a.createdAt).getTime();
              const dateB = new Date(b.createdAt).getTime();
              return dateB - dateA; // ใหม่สุดก่อน
            })

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

  showStatus(status: string){
    switch (status) {
      case 'NOT_PROCESSED' : return 'กำลังตรวจสอบ';
      case 'Success' : return 'ชำระเงินเรียบร้อย';
      default : return 'จัดส่งเรียบร้อย'
    }
  }

  viewHistory(id: number){
    this.selectedHistory = id
    this.setHistoryDetail()
    this.historyModal = true
  }

  setHistoryDetail() {
    const selectedOrder = this.order.find(order => order.id === this.selectedHistory);

    if (selectedOrder) {
      this.selectedHistoryDetail = selectedOrder;
  
      // reset ข้อมูล
      this.selectedHistoryProducts = [];
  
      selectedOrder.products.forEach((productOnOrder: any) => {
        const productData = {
          title: productOnOrder.product.title,
          quantity: productOnOrder.count,
          price: productOnOrder.price
        };
        this.selectedHistoryProducts?.push(productData);
      });
    }
  }

  closeHistory(){
    this.historyModal = false
  }

}
