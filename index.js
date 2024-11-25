const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Ortam değişkenlerini yükle
dotenv.config();

// MongoDB bağlantısını yap
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch((error) => console.error('MongoDB bağlantı hatası:', error));

const ProductRoute = require('./routes/product'); // Doğru yolu kontrol edin

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json()); // JSON gövde verilerini ayrıştır

// Rotayı kullan
app.use('/api/product', ProductRoute); // Bu satırda 'ProductRoute' bir middleware fonksiyonu olmalı
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
