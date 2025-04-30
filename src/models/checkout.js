import mongoose from 'mongoose';

  const CheckoutSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    items: { type: Array, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
  });
  
  export const Checkout = mongoose.model('Checkout', CheckoutSchema);