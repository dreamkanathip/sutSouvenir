import { Product } from "../products/products.model";
import { UserModel } from "../user/user.model";

export interface ReviewModel {
    id: number,
    productId: number,
    userId: number,
    star: number,
    comment?: string,
    createdAt:    Date,
    updatedAt:    Date,
    user?: UserModel
    product?: Product,
    
}

export interface ReviewResponse {
    reviews: ReviewModel[];
}