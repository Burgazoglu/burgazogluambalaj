const multer = require('multer');
const path = require('path');

// Kaydetme ayarları
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Tüm dosyalar "uploads" klasörüne kaydedilecek
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); 
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Benzersiz isim ver, orijinal uzantıyı koru
  }
});

// Sadece resim dosyalarına izin ver (JPEG, PNG, vs.)
const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir!'));
    }
  }
});

module.exports = upload;
