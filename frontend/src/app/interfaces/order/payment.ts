export interface Payment {
    id:             number,           
    total:          number,
    orderId:        number,
    addressId:      number,
    userId:         number,
    originBankId:   number,
    destBankId:     number,
    receipt:        string,
    lastFourDigits: string,
    transferAt:     Date,
}
