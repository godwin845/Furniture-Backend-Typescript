import * as productService from '../service/productService.js';  // Add `.js` for ES modules

// Fetch all products
export const getProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new product
export const addProduct = async (req, res) => {
  const { name, price, imageUrl } = req.body;
  try {
    const newProduct = await productService.addProduct(name, price, imageUrl);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing product
export const updateProduct = async (req, res) => {
  const { name, price, imageUrl } = req.body;
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, name, price, imageUrl);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};