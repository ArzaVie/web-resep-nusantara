const validateRecipe = (req, res, next) => {
    const { title, category, difficulty, ingredients, steps } = req.body;

    // Validasi data utama
    if (!title || !category || !difficulty) {
        return res.status(400).json({ message: "Judul, kategori, dan tingkat kesulitan harus diisi!" });
    }

    // Validasi minimal 1 bahan (Poin 11)
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0 || ingredients[0].trim() === '') {
        return res.status(400).json({ message: "Minimal harus ada 1 bahan untuk menambah resep!" });
    }

    // Validasi minimal 1 langkah (Poin 11)
    if (!steps || !Array.isArray(steps) || steps.length === 0 || steps[0].trim() === '') {
        return res.status(400).json({ message: "Minimal harus ada 1 langkah untuk menambah resep!" });
    }

    // Jika semua validasi lolos, lanjut ke proses berikutnya (Controller)
    next();
};

module.exports = validateRecipe;