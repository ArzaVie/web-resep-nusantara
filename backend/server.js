const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/database'); 

const app = express();

// Middlewares bawaan
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- TAMBAHKAN DUA BARIS INI ---
const recipeRoutes = require('./routes/recipeRoutes');
app.use('/api', recipeRoutes); // Prefix '/api' agar rapi
// -------------------------------

// Rute tes sederhana
app.get('/', (req, res) => {
    res.send('Server Resep Nusantara API berjalan!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});