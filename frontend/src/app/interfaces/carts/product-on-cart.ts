import { CartComponent } from "../../components/cart/cart.component";
import { Product } from "../products/products.model";
import { Carts } from "./carts";

export interface ProductOnCart {
    id: number,
    cartId: number,
    cart: Carts,
    productId: number,
    product:   Product, 
    quantity: number,
    price: number,
    selected?: boolean,
    newTotalPrice?: number
}