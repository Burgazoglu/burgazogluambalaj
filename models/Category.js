const mongoose = require('mongoose');

// Kategori şeması
const Category = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,  // Kategori adı zorunlu
      unique: true,    // Her kategorinin adı benzersiz olmalı
      trim: true,      // Kategori adı başta ve sondaki boşluklardan temizlenir
    },
    description: {
      type: String,
      trim: true,      // Açıklama da baştaki ve sondaki boşluklardan arındırılır
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // Kendi kendine referans
      default: null,   // Alt kategori değilse null
    },
  },
  { timestamps: true }  // Otomatik olarak createdAt ve updatedAt tarihleri ekler
);

// Kategori modelini oluştur
const Categorys = mongoose.model('Category', Category);

module.exports = Categorys;
