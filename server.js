require('dotenv').config(); // ✅ Charger les variables d’environnement dès le début

const express = require('express');
const cors = require('cors');
const Product = require('./models/product.js'); // Vérifie que le chemin est bon
const paymentRoutes = require('./routes/paymentRoutes');
const sampleProducts = require('./data/data.json');
const connectDB = require('./dbconnection/mongodbconnexion.js');

const app = express();
app.use(cors());
app.use(express.json()); // ✅ Pour parser le JSON dans les requêtes POST/PUT

// ✅ Vérifie que la clé Stripe est bien définie
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ Erreur : la clé STRIPE_SECRET_KEY est absente du fichier .env.");
  process.exit(1);
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
console.log("✅ Stripe Secret Key détectée");

// ✅ Routes API
app.use('/api/payment', paymentRoutes);

// ✅ Route pour récupérer les produits
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error("Erreur récupération produits :", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Fonction de seed automatique depuis `data.json`
const seedProducts = async () => {
  try {
    for (let p of sampleProducts) {
      await Product.updateOne(
        { name: p.name },
        { $set: p },
        { upsert: true }
      );
      console.log(`✅ Produit synchronisé : ${p.name}`);
    }
    console.log('📦 Produits synchronisés avec data.json');
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation des produits :', error.message);
  }
};

// ✅ Connexion MongoDB et lancement du serveur
connectDB().then(() => {
  seedProducts(); // exécution après connexion réussie
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Serveur en cours d’exécution sur le port ${PORT}`);
  });
});
