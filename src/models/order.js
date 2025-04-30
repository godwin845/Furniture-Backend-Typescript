import mongoose from 'mongoose';

const shippingAddressSchema = new mongoose.Schema({
  name: String,
  address: String,
});

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    paymentId: String,
    amount: Number,
    date: String,
    deliveryDate: String,
    shippingAddress: shippingAddressSchema,
  });

  export const Order = mongoose.model('Order', orderSchema);
