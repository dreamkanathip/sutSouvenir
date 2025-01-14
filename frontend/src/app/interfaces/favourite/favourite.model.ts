import { Product } from "../products/products.model";
import { UserModel } from "../user/user.model";

export interface FavouriteModel {
    id: number,
    user: UserModel
    product: Product
}

export interface FavouriteResponse {
    id: Number,
    userId: Number,
    productId: Number,
    product: Product
}