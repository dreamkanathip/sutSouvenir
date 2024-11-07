import { ProductOnCart } from "./product-on-cart"


export interface Carts {
    id: number,
    products: ProductOnCart,
    cartTotal: number,
    // createdAt   DateTime        @default(now())
    // updatedAt   DateTime        @updatedAt
    // user   User            @relation(fields: [userId], references: [id])
    userId: number
}
