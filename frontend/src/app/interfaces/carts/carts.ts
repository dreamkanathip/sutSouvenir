export interface Carts {
    id: number,
    cartTotal: number,
    // createdAt   DateTime        @default(now())
    // updatedAt   DateTime        @updatedAt
    // user   User            @relation(fields: [userId], references: [id])
    userId: number
}
