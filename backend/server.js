const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs'); // Bcryptjs kütüphanesi
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
const port = 3001;

// Veritabanı bağlantısı
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1905',
  database: 'stock'
});

db.connect(err => {
  if (err) {
    console.error('Veritabanına bağlanırken hata oluştu: ' + err.stack);
    return;
  }
  console.log('Veritabanına bağlandı. Bağlantı ID: ' + db.threadId);
});

app.use(cors({
  origin: 'http://localhost:5173', // İstemci uygulamanızın adresi
  credentials: true // Gerekirse credentials (çerezler, kimlik doğrulama bilgileri) kullanılabilir
}));

app.use(express.json());


// const adminUsername = 'admin';
// const adminPassword = 'admin'; // Admin kullanıcısının düz metin şifresi

// bcrypt.hash(adminPassword, 10, async (err, hashedPassword) => {
//   if (err) {
//     console.error('Şifre hashleme hatası:', err);
//     return;
//   }
  
//   const insertQuery = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
//   const values = [adminUsername, hashedPassword, 'admin'];

//   db.query(insertQuery, values, (err, results) => {
//     if (err) {
//       console.error('Admin kullanıcısı eklenirken hata oluştu:', err);
//       return;
//     }
//     console.log('Admin kullanıcısı başarıyla eklendi');
//   });
// });














app.get('/users', (req, res) => {
  const query = 'SELECT id, username, role FROM users';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Kullanıcılar getirilirken hata oluştu:', err);
      return res.status(500).json({ msg: 'Sunucu hatası' });
    }

    res.json(results);
  });
});







// Backend: login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Veritabanı sorgusu yapılırken hata oluştu: ' + err);
      return res.status(500).json({ msg: 'Sunucu hatası' });
    }

    if (results.length > 0) {
      const user = results[0];

      // Şifre karşılaştırma
      try {
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          // Eğer şifreler eşleşiyorsa JWT token oluştur
          const token = jwt.sign({ id: user.id, role: user.role }, 'secretkey', { expiresIn: '1h' });
          res.json({ token, role: user.role }); // role bilgisini de döndür
        } else {
          res.status(400).json({ msg: 'Geçersiz kimlik bilgileri' });
        }
      } catch (error) {
        console.error('Şifre karşılaştırma hatası:', error);
        res.status(500).json({ msg: 'Sunucu hatası' });
      }
    } else {
      res.status(400).json({ msg: 'Kullanıcı bulunamadı' });
    }
  });
});



app.delete('/users/:id', async (req, res) => {
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Kullanıcı silinirken hata oluştu: ' + err);
      return res.status(500).json({ msg: 'Sunucu hatası' });
    }
    
    if (results.affectedRows > 0) {
      res.json({ msg: 'Kullanıcı başarıyla silindi' });
    } else {
      res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
    }
  });
});


app.put('/users/:id', async (req, res) => {
  const { username, password, role } = req.body;
  const query = 'UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?';
  db.query(query, [username, password, role, req.params.id], (err, results) => {
    if (err) {
      console.error('Kullanıcı güncellenirken hata oluştu: ' + err);
      return res.status(500).json({ msg: 'Sunucu hatası' });
    }

    if (results.affectedRows > 0) {
      res.json({ msg: 'Kullanıcı başarıyla güncellendi' });
    } else {
      res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
    }
  });
});


app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || username.trim() === '') {
    return res.status(400).json({ msg: 'Kullanıcı adı boş olamaz' });
  }

  // Kullanıcı adı var mı kontrol et
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Veritabanı sorgusu yapılırken hata oluştu: ' + err);
      return res.status(500).json({ msg: 'Sunucu hatası' });
    }

    if (results.length > 0) {
      return res.status(400).json({ msg: 'Kullanıcı adı zaten kullanılıyor' });
    }
  


    // Şifre hashleme
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        console.error('Şifre hashleme hatası:', err);
        return res.status(500).json({ msg: 'Sunucu hatası' });
      }

      // Kullanıcıyı veritabanına ekleme
      const insertQuery = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
      const values = [username, hashedPassword, role];

      db.query(insertQuery, values, (err, results) => {
        if (err) {
          console.error('Kullanıcı eklenirken hata oluştu:', err);
          return res.status(500).json({ msg: 'Sunucu hatası' });
        }
        res.json({ msg: 'Kullanıcı başarıyla oluşturuldu' });
      });
    });
  });
}
);


app.post('/stock', (req, res) => {
  const { Product_Number, Product_Name, Quantity, Category, PurchasePrice, SellingPrice,  Supplier, Currency } = req.body;

  const query = 'INSERT INTO stock (Product_Number, Product_Name, Quantity, Category, PurchasePrice, SellingPrice,  Supplier, Currency) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [Product_Number, Product_Name, Quantity, Category, PurchasePrice, SellingPrice, Supplier, Currency];
  

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Ürün eklenirken hata oluştu:', err);
      return res.status(500).json({ msg: 'Sunucu hatası' });
    }
    res.json({ msg: 'Ürün başarıyla eklendi', productId: results.insertId });
  });
});

app.get('/stock', (req, res) => {
  const query = 'SELECT * FROM stock';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Ürünler getirilirken hata oluştu:', err);
      return res.status(500).json({ msg: 'Sunucu hatası' });
    }
    res.json(results);
  });
});

app.delete('/stock/:Product_Number', async (req, res) => {
  const query = 'DELETE FROM stock WHERE Product_Number = ?';
  db.query(query, [req.params.Product_Number], (err, results) => {
    if (err) {
      console.error('Ürün silinirken hata oluştu: ' + err);
      return res.status(500).json({ msg: 'Sunucu hatası' });
    }
    if (results.affectedRows > 0) {
      res.json({ msg: 'Ürün başarıyla silindi' });
    } else {
      res.status(404).json({ msg: 'Ürün bulunamadı' });
    }
  });
});


app.put('/stock/:Product_Number', async (req, res) => {
  const { Product_Name, Quantity, Category, PurchasePrice, SellingPrice, Supplier, Currency } = req.body;
  const query = 'UPDATE stock SET Product_Name = ?, Quantity = ?, Category = ?, PurchasePrice = ?, SellingPrice = ?, Supplier = ?, Currency = ? WHERE Product_Number = ?';
  const values = [Product_Name, Quantity, Category, PurchasePrice, SellingPrice, Supplier, Currency, req.params.Product_Number];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Ürün güncellenirken hata oluştu: ' + err);
      return res.status(500).json({ msg: 'Sunucu hatası' });
    }
    if (results.affectedRows > 0) {
      res.json({ msg: 'Ürün başarıyla güncellendi' });
    } else {
      res.status(404).json({ msg: 'Ürün bulunamadı' });
    }
  });
});



app.get('/stock/:Product_Number', async (req, res) => {
  const { Product_Number } = req.params;
  const query = 'SELECT * FROM stock WHERE Product_Number = ?';

  db.query(query, [Product_Number], (err, results) => {
    if (err) {
      console.error('Ürün getirilirken hata oluştu:', err);
      return res.status(500).json({ msg: 'Sunucu hatası' });
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ msg: 'Ürün bulunamadı' });
    }
  });
});



app.put('/stock/quantity/:Product_Number', (req, res) => {
  const { Quantity } = req.body;
  const query = 'UPDATE stock SET Quantity = ? WHERE Product_Number = ?';
  const values = [Quantity, req.params.Product_Number];

  db.query(query, values, (err, results) => {
      if (err) {
          console.error('Ürün güncellenirken hata oluştu:', err);
          return res.status(500).json({ msg: 'Sunucu hatası' });
      }
      if (results.affectedRows > 0) {
          res.json({ msg: 'Ürün başarıyla güncellendi' });
      } else {
          res.status(404).json({ msg: 'Ürün bulunamadı' });
      }
  });
});


app.get('/customers', (req, res) => {
  const query = 'SELECT id, name, address, phone, email FROM customers';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Müşteriler getirilirken hata oluştu:', err);
      return res.status(500).json({ msg: 'Sunucu hatası' });
    }

    res.json(results);
  });
});

app.post('/customers', (req, res) => {
  const { name, address, phone, email } = req.body;
  const query = 'INSERT INTO customers (name, address, phone, email) VALUES (?, ?, ?, ?)';
  const values = [name, address, phone, email];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Müşteri eklenirken hata oluştu:', err);
      return res.status(500).json({ msg: 'Sunucu hatası' });
    }
    res.json({ msg: 'Müşteri başarıyla eklendi', customerId: results.insertId });
  });
});

app.delete('/customers/:id', async (req, res) => {
  const query = 'DELETE FROM customers WHERE id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Müşteri silinirken hata oluştu: ' + err);
      return res.status(500).json({ msg: 'Sunucu hatası' });
    }
    
    if (results.affectedRows > 0) {
      res.json({ msg: 'Müşteri başarıyla silindi' });
    } else {
      res.status(404).json({ msg: 'Müşteri bulunamadı' });
    }
  });
});

app.put('/customers/:id', async (req, res) => {
  const { name, address, phone, email } = req.body;
  const query = 'UPDATE customers SET name = ?, address = ?, phone = ?, email = ? WHERE id = ?';
  const values = [name, address, phone, email, req.params.id];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Müşteri güncellenirken hata oluştu: ' + err);
      return res.status(500).json({ msg: 'Sunucu hatası' });
    }

    if (results.affectedRows > 0) {
      res.json({ msg: 'Müşteri başarıyla güncellendi' });
    } else {
      res.status(404).json({ msg: 'Müşteri bulunamadı' });
    }
  });
});

app.get('/customers/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM customers WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Müşteri getirilirken hata oluştu:', err);
      return res.status(500).json({ msg: 'Sunucu hatası' });
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ msg: 'Müşteri bulunamadı' });
    }
  });
});



app.post('/invoices', (req, res) => {
  const { customer, products, total } = req.body;
  const query = 'INSERT INTO invoices (customer_name, customer_address, customer_phone, customer_email, total_price) VALUES (?, ?, ?, ?, ?)';
  const values = [customer.name, customer.address, customer.phone, customer.email, total];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Fatura eklenirken hata oluştu:', err);
      return res.status(500).json({ msg: 'Sunucu hatası' });
    }

    const invoiceId = result.insertId;
    const productQueries = products.map(product => {
      return new Promise((resolve, reject) => {
        const productQuery = 'INSERT INTO invoice_products (invoiceId, productName, quantity, price, Currency) VALUES (?, ?, ?, ?, ?)';
        const productValues = [invoiceId, product.product.Product_Name, product.quantity, product.product.SellingPrice, product.product.Currency]; // Currency alanını ekledik
        db.query(productQuery, productValues, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    });

    Promise.all(productQueries)
      .then(() => res.json({ msg: 'Fatura başarıyla kaydedildi' }))
      .catch(err => {
        console.error('Fatura ürünleri eklenirken hata oluştu:', err);
        res.status(500).json({ msg: 'Sunucu hatası' });
      });
  });
});



app.get('/invoices', (req, res) => {
  const query = 'SELECT * FROM invoices';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Faturalar getirilirken hata oluştu:', err);
      return res.status(500).json({ msg: 'Sunucu hatası' });
    }

    res.json(results);
  });
});




app.get('/invoices/:id', (req, res) => {
  const invoiceId = req.params.id;
  const query = `
    SELECT invoices.*, invoice_products.productName, invoice_products.quantity, invoice_products.price, invoice_products.Currency
    FROM invoices
    LEFT JOIN invoice_products ON invoices.id = invoice_products.invoiceId
    WHERE invoices.id = ?
  `;

  db.query(query, [invoiceId], (err, results) => {
    if (err) {
      console.error('Fatura getirilirken hata oluştu:', err);
      return res.status(500).json({ msg: 'Sunucu hatası' });
    }

    if (results.length > 0) {
      const invoice = {
        id: results[0].id,
        customer: {
          name: results[0].customer_name,
          address: results[0].customer_address,
          phone: results[0].customer_phone,
          email: results[0].customer_email,
        },
        products: results.map(row => ({
          productName: row.productName,
          quantity: row.quantity,
          price: row.price,
          currency: row.Currency, // Para birimi bilgisini ekledik
        })),
        totalPrice: results[0].total_price,
      };
      res.json(invoice);
    } else {
      res.status(404).json({ msg: 'Fatura bulunamadı' });
    } 
  });
});





app.get('/sales', (req, res) => {
  const query = `
    SELECT invoice_products.productName, SUM(invoice_products.quantity) AS quantitySold
    FROM invoice_products
    GROUP BY invoice_products.productName
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Satış verileri alınırken hata oluştu:', err);
      return res.status(500).json({ msg: 'Sunucu hatası' });
    }

    res.json(results);
  });
});



app.get('/currency', (req, res) => {
  const query = 
  'SELECT invoice_products.Currency, SUM(invoice_products.price) AS totalSales FROM invoice_products GROUP BY invoice_products.Currency';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Para birimi verileri alınırken hata oluştu:', err);
      return res.status(500).json({ msg: 'Sunucu hatası' });
    }
    console.log('Sorgu sonuçları:', results);
    res.json(results);
  });
});



app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor`);
});







