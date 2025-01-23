import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { ProductOnCart } from '../../interfaces/carts/product-on-cart';
import { Carts } from '../../interfaces/carts/carts';
import { OrderService } from '../../services/order/order.service';
import { Router } from '@angular/router';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { Shipping } from '../../interfaces/shipping/shipping.model';
import { AddressService } from '../../services/address/address.service';
import { AddressModel } from '../../interfaces/address/address.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{

  productOnCart!: ProductOnCart[];
  cart!: Carts
  selectAll: boolean = true;
  sumItemPrice: number = 0;
  orderId!: number
  selectedQuantity: number = 0;
  userId: number = 1;
  selectedShipping!: Shipping
  defaultAddress?: AddressModel;
  
  constructor(
    private cartService: CartService, 
    private orderService: OrderService, 
    private router: Router,
    private addressService: AddressService,
  ) {
  }

  ngOnInit(): void {
    this.getProductOnCart(1) //passing userId
    this.getCartById(1) //passing userId
    this.toggleSelectAll()
    this.getDefaultAddress()
  }

  onQuantityInputChange(item: any): void {
    const previousQuantity = item.quantity;
    if (item.quantity >= item.product.quantity && item.product.quantity !=0 ) {
      Swal.fire({
        title: "สินค้าเกินจำนวนที่มีในคลัง",
        text: `จำนวนสินค้าในคลังมีเพียง ${item.product.quantity} ชิ้น`,
        icon: "warning",
        confirmButtonText: "ตกลง",
      }).then(() => {
        item.quantity = item.product.quantity;
      })
    } else if (item.product.quantity <= 0) {
      Swal.fire({
        title: "สินค้าหมดแล้ว",
        text: "โปรดรอสินค้า",
        confirmButtonText: "ตกลง",
        icon: "warning",
        confirmButtonColor: "#F36523",
      }).then(() => {
        item.quantity = previousQuantity;
      });
    } else if (item.quantity <= 0) {
      item.quantity = Math.max(1, Math.min(Number(item.quantity), item.product.quantity));
      if (isNaN(item.quantity)) {
        item.quantity = 1;
      }
    }
    this.calculateIndividualItemPrice()
  }

  onShippingSelected($e:any) {
    this.selectedShipping = $e
  }
  getProductOnCart(userId: any) {
    const selectedMap = new Map(
      this.productOnCart?.map((item) => [item.productId, item.selected])
    );

    this.cartService.getProductOnCart(userId).subscribe((res) => {
      const isArray = Array.isArray(res)
      if(isArray) {
        this.productOnCart = res.map((item) => ({
          ...item,
          selected: selectedMap.get(item.productId) || true,
          newTotalPrice: item.price
        }));
        this.calculateSelectedQuantity()
      }
      this.updateTotalPrice();
      this.calculateIndividualItemPrice()
    });
  }
  getCartById(userId: any) {
    this.cartService.getCartById(userId).subscribe((res) => {
      this.cart = res
    })
  }
  individualSelect(productId: any) {
    const item = this.productOnCart?.find((i) => i.productId === productId)
    if (item) {
      item.selected = !item.selected
      this.calculateSumItemPrice()
    }
  }
  checkIndividualSelect() {
    this.selectAll = this.productOnCart?.every((i) => i.selected === true);
  }
  toggleSelectAll() {
    if (this.productOnCart) {
      const newSelectState = !this.selectAll;
      this.productOnCart.forEach((i) => i.selected = newSelectState);
      this.selectAll = newSelectState;
      this.calculateSumItemPrice()
    } 
  }

  //when select and deselect
  calculateSumItemPrice() {
    this.sumItemPrice = this.productOnCart
      .filter((i) => i.selected)
      .reduce((sum, item) => sum + (item.newTotalPrice ?? 0), 0) || 0
  }
  updateTotalPrice(): void {
    this.sumItemPrice = this.productOnCart?.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }
  calculateIndividualItemPrice() {
    this.productOnCart?.map((item) => {
      item.newTotalPrice = item.product.price * item.quantity;
    })
  }
  calculateSelectedQuantity() {
    this.selectedQuantity = this.productOnCart? this.productOnCart.reduce((count, item) => count + (item.selected? 1:0), 0) : 0
  }

  increaseQuantity(item: any) {
    const data = {
      userId: this.userId,
      productId: item.productId
    }

    if (item.quantity >= item.product.quantity) {
      Swal.fire({
        title: "สินค้าเกินจำนวนที่มีในคลัง",
        text: `จำนวนสินค้าในคลังมีเพียง ${item.product.quantity} ชิ้น`,
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return; // Stop further execution
    }
    this.cartService.increaseProductOnCart(data).subscribe({
      next: () => {
        const product = this.productOnCart.find((p) => p.productId === item.productId);
        if (product) {
          product.quantity += 1;
          this.updateTotalPrice();
          this.calculateIndividualItemPrice()
        }
      },
      error: (err) => console.error('Error increasing quantity:', err),
    });
  }

  decreaseQuantity(item: any) {
    const data = {
      userId: 1,
      productId: item.productId
    }
    if (item.quantity > 1) {
      this.cartService.decreaseProductOnCart(data).subscribe({
        next: () => {
          const product = this.productOnCart.find((p) => p.productId === item.productId);
          if (product) {
            product.quantity -= 1;
            this.updateTotalPrice();
            this.calculateIndividualItemPrice()
          }
        },
        error: (err) => console.error('Error decreasing quantity:', err),
      });
    }
  }

  

  removeProductOnCart(productId: any) {
    const data = {
      userId: this.userId,
      productId: productId
    }
    console.log(data)


    return firstValueFrom(
      this.cartService.removeProductOnCart(productId).pipe(
        tap(() => {
          this.productOnCart = this.productOnCart.filter(
            (p) => p.productId !== productId
          );
          this.updateTotalPrice();
          this.calculateSelectedQuantity();
          this.cartService.updateCartItemCount(this.userId);
        }),
        catchError((err) => {
          console.error('Error during delete:', err);
          return of(null);
        })
      )
    );
  }

  removeWithoutRestock(productId: any) {
    this.cartService.removeWithoutRestock(productId).subscribe(() => {
      this.updateTotalPrice();
      this.calculateSelectedQuantity();
      this.cartService.updateCartItemCount(this.userId);
    })
  }
  async goToPayment() {
    try {
      const data = {
        userId: this.userId,
        cartTotal: this.sumItemPrice + this.selectedShipping.fees,
        addressId: this.defaultAddress?.id ,
        shippingId: this.selectedShipping.id
      };
      const selectedItem = this.productOnCart?.filter((i) => i.selected === true);

      const initialOrderResponse = await firstValueFrom(this.orderService.initialOrder(data));
      this.orderId = initialOrderResponse.id;

      const orderDetailsPromises = selectedItem.map((item) => {
        const detail = {
          productId: item.productId,
          orderId: this.orderId,
          quantity: item.quantity,
          total: item.product.price * item.quantity,
        };
        return firstValueFrom(this.orderService.addOrderDetail(detail));
      });
      await Promise.all(orderDetailsPromises);

      this.sumItemPrice = this.productOnCart
      .filter((i) => i.selected)
      .reduce((sum, item) => sum + (item.newTotalPrice ?? 0), 0) || 0

      const removePromises = this.productOnCart.filter((item) => item.selected).map((item) => 
        this.removeWithoutRestock(item.productId)
      );
      await Promise.all(removePromises);

      this.cartService.updateCartItemCount(this.userId);
      this.orderService.setOrderId(this.orderId)
      await this.router.navigate(['/payment'])

    } catch (error) {
      console.error('Error during payment process:', error);
      if(!this.defaultAddress) {
        Swal.fire({
          title: "กรุณาเลือกที่อยู่สำหรับจัดส่ง",
          confirmButtonText: "ยืนยัน",
          icon: "warning",
          confirmButtonColor: "#d33",
        })
      } else if (!this.selectedShipping){
        Swal.fire({
          title: "กรุณาเลือกวิธีการจัดส่ง",
          confirmButtonText: "ยืนยัน",
          icon: "warning",
          confirmButtonColor: "#d33",
        })
      }
    }
  }

  toHome() {
    this.router.navigate(["/home"])
  }

  removeItem(productId: number) {
    Swal.fire({
      title: "ลบรายการสินค้าจากตะกร้าหรือไม่",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      icon: "warning",
      confirmButtonColor: "#d33",
      // cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          this.removeProductOnCart(productId)
          Swal.fire("สำเร็จ", "ลบรายการสินค้าเรียบร้อย", "success");
        } catch (error) {
          Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบสินค้าได้", "error");
        }
      }
    }) 
  }
  // also mean deleting cart but the product quantity will be return
  async removeAllProductOnCart() {
    const result = await Swal.fire({
      title: "ลบรายการสินค้าทั้งหมดหรือไม่",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      icon: "warning",
      confirmButtonColor: "#d33",
      // cancelButtonColor: "#d33",
    });
  
    if (result.isConfirmed) {
      Swal.fire({
        title: "กำลังลบ...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
  
      try {
        const removePromises = this.productOnCart.map((item) => 
          this.removeProductOnCart(item.productId)
        );
        await Promise.all(removePromises);
        await firstValueFrom(this.cartService.deleteCart(this.userId));
        Swal.fire("สำเร็จ", "ลบรายการสินค้าทั้งหมดเรียบร้อย", "success");
      } catch (error) {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบสินค้าได้", "error");
      }
    }
  }

  getDefaultAddress() {
    this.addressService.getDefaultAddress().subscribe(res => {
      this.defaultAddress = res
    })
  }
  defaultAddressChanged() {
    this.getDefaultAddress()
  }
}

