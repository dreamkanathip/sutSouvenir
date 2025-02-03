import { AddressModel } from "../address/address.model";
import { Shipping } from "../shipping/shipping.model";
import { UserModel } from "../user/user.model";
import { Payment } from "./payment";
import { ProductOnOrder } from "./product-on-order";

export interface Order {
    id: number,
    cartTotal: number,
    orderStatus: string,
    products: ProductOnOrder[],
    shipping:    Shipping,
    shippingId: number,
    address:     AddressModel,
    addressId: number,
    createdAt:   Date,
    updatedAt:  Date,
    user: UserModel,
    userId: number,
    payments: Payment[],   
    trackingNumber: string   
}

export interface userOrder {
    orders: Order[]
}
