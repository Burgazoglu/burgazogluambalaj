const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const upload = require('./upload'); // Az önce yazdığımız multer yapılandırması
// Kategori ekleme örneği
router.post('/addNewCategories', async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// // Ürün ekleme örneği
router.post('/addNewProducts', upload.array('images', 5), async (req, res) => {
  try {
    // Resimlerin URL'lerini al
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

    console.log("Request body:", req.body); // Gelen veriyi kontrol et
    console.log("Uploaded files:", req.files); // Gelen dosyaları kontrol et


    // Gelen diğer alanları al
    const newProduct = new Product({
      ...req.body,        // JSON'dan gelen diğer alanlar
      image_url: imageUrls // Resim URL'lerini kaydet
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Kategorilerin tümünü listeleme
router.get('/getAllCategories', async (req, res) => {
  try {
    const categories = await Category.find(); // Kategorilerin tümünü getir
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ürünlerin tümünü listeleme
router.get('/getAllProducts', async (req, res) => {
  try {
    const products = await Product.find() // Ürünlerin tümünü getir
      .populate('category_id', 'name') // category_id alanını populate et
      .lean() // Mongoose'un dönen veriyi düz JavaScript objelerine dönüştürmesini sağlar
      .exec();

    // Kategoriyi dönüştürme
    const formattedProducts = products.map(product => {
      return {
        ...product,
        category: {
          id: product.category_id._id,
          name: product.category_id.name
        }
      };
    });
    res.status(200).json(formattedProducts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/deleteProduct/:id', async (req, res) => {
  try {
    const { id } = req.params; // Silinecek ürünün ID'sini al

    // Ürünü sil
    const deletedProduct = await Product.findByIdAndDelete(id);

    // Eğer ürün bulunamazsa
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Ürün bulunamadı!' });
    }

    res.status(200).json({ message: 'Ürün başarıyla silindi!', product: deletedProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/deleteCategory/:id', async (req, res) => {
  try {
    const { id } = req.params; // Silinecek kategorinin ID'sini al

    // Öncelikle ilgili kategorinin bir üründe kullanılıp kullanılmadığını kontrol et
    const isCategoryUsed = await Product.findOne({ category_id: id });

    // Eğer kategori kullanılıyorsa hata döndür
    if (isCategoryUsed) {
      return res.status(400).json({ 
        message: 'Bu kategori bazı ürünlerde kullanılıyor, bu yüzden silinemez!' 
      });
    }

    // Kategori silme işlemi
    const deletedCategory = await Category.findByIdAndDelete(id);

    // Eğer kategori bulunamazsa
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Kategori bulunamadı!' });
    }

    res.status(200).json({ message: 'Kategori başarıyla silindi!', category: deletedCategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/getProductsByCategory/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params; // Seçilen kategori ID'sini al

    // Kategori ID'sine bağlı tüm ürünleri getir ve category_id'yi populate et
    const products = await Product.find({ category_id: categoryId })
      .populate('category_id', 'name')
      .lean()
      .exec();

    // Ürünleri formatla
    const formattedProducts = products.map(product => {
      return {
        ...product,
        category: {
          id: product.category_id._id,
          name: product.category_id.name
        }
      };
    });

    // Başarılı yanıt gönder
    res.status(200).json({
      isSuccess: true,
      data: formattedProducts
    });
  } catch (error) {
    // Hata durumunda isSuccess: false döndür
    res.status(400).json({
      isSuccess: false,
      error: error.message
    });
  }
});


module.exports = router;  // Router'ı dışa aktar
