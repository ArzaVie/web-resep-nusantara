const db = require('../config/database');

// Mendapatkan Semua Resep (GET /resepUMKM)
const getAllRecipes = async (req, res) => {
    try {
        // Ambil data dari tabel recipes
        const [recipes] = await db.query('SELECT * FROM recipes ORDER BY created_at DESC');

        // Melakukan perulangan untuk mengambil bahan dan langkah tiap resep
        for (let recipe of recipes) {
            const [ingredients] = await db.query('SELECT name FROM ingredients WHERE recipe_id = ?', [recipe.id]);
            const [steps] = await db.query('SELECT instruction FROM steps WHERE recipe_id = ? ORDER BY id ASC', [recipe.id]);

            // Menyisipkan data bahan dan langkah ke dalam objek resep
            recipe.ingredients = ingredients.map(item => item.name);
            recipe.steps = steps.map(item => item.instruction);
        }

        res.status(200).json({ success: true, data: recipes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengambil data resep.' });
    }
};

// Menambahkan Resep Baru (POST /resepUMKM)
const addRecipe = async (req, res) => {
    const { title, category, difficulty, ingredients, steps } = req.body;

    try {
        // 1. Simpan ke tabel recipes
        const [recipeResult] = await db.query(
            'INSERT INTO recipes (title, category, difficulty) VALUES (?, ?, ?)',
            [title, category, difficulty]
        );
        const recipeId = recipeResult.insertId; // Dapatkan ID resep yang baru dibuat

        // 2. Simpan array bahan ke tabel ingredients
        for (let ingredient of ingredients) {
            if (ingredient.trim() !== '') {
                await db.query('INSERT INTO ingredients (recipe_id, name) VALUES (?, ?)', [recipeId, ingredient]);
            }
        }

        // 3. Simpan array langkah ke tabel steps
        for (let step of steps) {
            if (step.trim() !== '') {
                await db.query('INSERT INTO steps (recipe_id, instruction) VALUES (?, ?)', [recipeId, step]);
            }
        }

        res.status(201).json({ success: true, message: 'Resep Nusantara berhasil ditambahkan!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menyimpan resep.' });
    }
};

module.exports = { getAllRecipes, addRecipe };