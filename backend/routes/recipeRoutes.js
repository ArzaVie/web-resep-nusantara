const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const validateRecipe = require('../middlewares/validateRecipe');

// Endpoint GET untuk mengambil data
router.get('/resepUMKM', recipeController.getAllRecipes);

// Endpoint POST untuk menyimpan data (Middleware validateRecipe diletakkan di tengah)
router.post('/resepUMKM', validateRecipe, recipeController.addRecipe);

module.exports = router;