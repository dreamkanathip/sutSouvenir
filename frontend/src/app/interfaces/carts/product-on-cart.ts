import { Product } from "../products/products.model";

export interface ProductOnCart {
    id: number,
    cartId: number,
    productId: number,
    product: Product,
    quantity: number,
    price: number,
    selected?: boolean;
}