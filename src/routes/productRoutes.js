const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product'); // Vérifie que ce chemin est correct
const router = express.Router();

// 🔹 Créer un produit
router.post('/', async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    // Vérification basique
    if (!name || !description || !price || !image || !category) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const product = new Product({ name, description, price, image, category });
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    console.error('Erreur création produit :', err);
    res.status(400).json({ message: 'Erreur lors de la création du produit.' });
  }
});

// 🔹 Récupérer tous les produits ou filtrer par catégorie
router.get('/', async (req, res) => {
  const { category } = req.query;

  try {
    const products = category
      ? await Product.find({ category })
      : await Product.find();

    res.status(200).json(products);
  } catch (err) {
    console.error('Erreur récupération produits :', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des produits.' });
  }
});

// 🔹 Récupérer un produit par ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  // ✅ Vérification de l'ID Mongo valide
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID invalide.' });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé.' });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error('Erreur récupération produit par ID :', err);
    res.status(500).json({ message: 'Erreur lors de la récupération du produit.' });
  }
});

module.exports = router;
