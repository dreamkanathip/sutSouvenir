export interface Order {
    id:           number,              
    cartTotal:    number,
    orderStatus:  string,   
    // createdAt:    Date,         
    // updatedAt:    Date,        
}

export interface userOrder {
    orders: Order[]
}
