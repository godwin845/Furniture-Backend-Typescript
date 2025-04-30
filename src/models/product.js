import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

const Product = model('Product', productSchema);

export default Product;