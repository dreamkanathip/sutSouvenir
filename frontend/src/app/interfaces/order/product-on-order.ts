import { Product } from "../products/products.model";
import { Order } from "./order";

export interface ProductOnOrder {
    id:        number,     
    product:   Product, 
    productId: number,
    order:     Order,   
    orderId:   number,
    count:     number,
    price:     number,
}
