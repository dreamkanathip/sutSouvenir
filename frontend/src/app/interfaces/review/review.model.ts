import { UserModel } from "../user/user.model";

export interface ReviewModel {
    id: number,
    productId: number,
    userId: number,
    star: number,
    comment?: string,
    user?: UserModel
}