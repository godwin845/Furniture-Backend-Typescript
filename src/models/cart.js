import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
    id: String,
    name: String,
    price: Number,
    quantity: Number,
    imageUrl: String,
  });
  
  const CartSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Or token/username
    items: [CartItemSchema],
    updatedAt: { type: Date, default: Date.now },
  });
  
  export const Cart = mongoose.model('Cart', CartSchema);