import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import Swal from 'sweetalert2';
import { OrderService } from '../../../services/order/order.service';
import { Order, userOrder } from '../../../interfaces/order/order';
import { Router } from '@angular/router';
import { ProductOnOrder } from '../../../interfaces/order/product-on-order';
import { Product } from '../../../interfaces/products/products.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {

  orders: any[] = []
  storage: any[] = [];
  selectedOrder!  : Order;
  productOnOrder!: ProductOnOrder[];
  historyModal: boolean = false
  selectedHistory?: number
  selectedHistoryDetail? : any // ProductsOnOrder
  selectedHistoryProducts? : any[] // รายการสินค้า
  filteredOrders: any[] = [];
  filterStatus: string = '';

  productRating!: any


  constructor(
    private userService: UserService, 
    private orderService: OrderService, 
    private router: Router,
  ){}

  ngOnInit(): void {
    this.getUserStorageItem();
  }

  getUserStorageItem() {
    this.userService.getUserStorage().subscribe({
      next: (items: userOrder) => {
        this.orders = items.orders;
        this.filteredOrders = items.orders;
      if (this.orders) {
        this.orders.forEach((order: any) => {
          if (order.products) {

            // เรียง orders จาก createdAt
            this.orders.sort((a: any, b: any) => {
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
      case 'NOT_PROCESSED' : return 'รอชำระเงิน';
      case 'CANCELLED' : return 'ยกเลิก';
      case 'SHIPPED' : return 'กำลังจัดส่ง';
      case 'DELIVERED' : return 'จัดส่งสำเร็จ';
      case 'PROCESSED' : return 'ยืนยันการสั่งซื้อ'
      default : return 'สถานะการสั่งซื้อผิดพลาด'
      // NOT_PROCESSED
      // PROCESSED
      // SHIPPED
      // DELIVERED
      // CANCELLED
    }
  }

  checkCancel(status : string) {
    if (status == 'NOT_PROCESSED') {
      return true
    } else {
      return false
    }
  }

  submitCancel(item: any) {
    Swal.fire({
      title: "ต้องการยกเลิกคำสั่งซื้อรายการนี้หรือไม่?",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "กลับ",
      icon: "warning",
    }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "กำลังลบข้อมูล...",
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });
      
            this.orderService.cancelOrder(item.id, item).subscribe({
              next: (res) => {
                Swal.close();
                Swal.fire({
                  icon: "success",
                  title: "ยกเลิกคำสั่งซื้อ",
                  text: "ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว",
                  showConfirmButton: true,
                });
                console.log(res)
                this.getUserStorageItem()
                this.closeHistory()
              },
              error: (error) => {
                Swal.close();
                Swal.fire({
                  icon: "warning",
                  title: "เกิดข้อผิดพลาด",
                  text: "เกิดข้อผิดพลาด กรุณาลองอีกครั้งในภายหลัง",
                  showConfirmButton: true,
                });
                console.error("API error:", error);
              }
            });
        }
    })
  }

  viewHistory(id: number){
    this.selectedHistory = id
    this.setHistoryDetail()
    this.historyModal = true
  }

  setHistoryDetail() {
    const selectedOrder = this.orders.find(order => order.id === this.selectedHistory);

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

  NavigateToPayment(item: Order){
    console.log(item)
    this.orderService.setOrderId(item.id)
    this.router.navigate(['/payment'])
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      return this.filterStatus? order.orderStatus === this.filterStatus: true;
    });
  }
  selectOrder(order: any): void {
    this.selectedOrder = order
  }

  getLatestProductRating(products: ProductOnOrder): number {
    if (!products.product.reviews || products.product.reviews.length === 0) {
      return 0;
    }
  
    const latestReview = products.product.reviews.reduce((latest, current) => {
      const latestDate = new Date(latest.createdAt).getTime();
      const currentDate = new Date(current.createdAt).getTime();
      return currentDate > latestDate ? current : latest;
    });
  
    this.productRating = latestReview.star
    return latestReview ? latestReview.star : 0;
  }
}
