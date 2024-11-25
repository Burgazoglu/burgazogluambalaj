const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 50000, // 20 saniye
        });
        console.log('MongoDB’ye bağlandı');
    } catch (error) {
        console.error('MongoDB bağlantı hatası:', error);
        process.exit(1); // Hata varsa uygulamayı kapat
    }
};

module.exports = connectDB;
