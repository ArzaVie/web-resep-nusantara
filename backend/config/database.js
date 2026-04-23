const mysql = require('mysql2');
require('dotenv').config();

// Membuat pool koneksi agar lebih efisien
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Ubah ke format Promise agar bisa pakai async/await nantinya
const db = pool.promise();

// Coba tes koneksi
db.getConnection()
    .then(connection => {
        console.log('✅ Berhasil terkoneksi ke database db_resep_umkm');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Gagal terkoneksi ke database:', err.message);
    });

module.exports = db;