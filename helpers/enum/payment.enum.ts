export enum PaymentStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Failed = 'Failed',
  Refunded = 'Refunded',
}

export enum PaymentMethod {
  Cash = 'Cash',
  Transfer = 'Transfer',
  QRIS = 'QRIS',
  GoPay = 'GoPay',
  OVO = 'OVO',
  Dana = 'Dana',
  LinkAja = 'LinkAja',
  ShopeePay = 'ShopeePay',
  // Add other payment methods as needed
}
