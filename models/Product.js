const mongoose = require('mongoose');

// Ürün şeması
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,  
      trim: true,      
    },
    description: {
      type: String,
      trim: true,      
    },
    price: {
      type: String,
      required: true,  
      min: 0,          
    },
    stock: {
      type: String,
      required: true,  
      min: 0,          
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', 
      required: true,  
    },
    image_url: {
      type: [String], // Burayı array olarak değiştirdik
      trim: true,      
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }  
);

// Ürün modelini oluştur
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
