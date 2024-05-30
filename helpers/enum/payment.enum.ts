export enum PaymentStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Failed = 'Failed',
  Refunded = 'Refunded',
}

export enum PaymentMethod {
  Cash = 'Cash',
  Transfer = 'Transfer',
  Midtrans = 'Midtrans',
  QRIS = 'QRIS',
  // Add other payment methods as needed
}
