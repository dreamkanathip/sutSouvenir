export interface Payment {
    id:             number,           
    total:          number,
    orderId:        number,
    userId:         number,
    originBankId:   number,
    destBankId:     number,
    receipt:        string,
    lastFourDigits: string,
    transferAt:     Date,
}
