const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/Cart');
const { protect } = require('./authRoutes'); // J'assume que tu as ce middleware pour l'auth

const router = express.Router();

// Route pour démarrer le paiement (checkout)
router.post('/checkout', protect, async (req, res) => {
    try {
        // Récupérer le panier de l'utilisateur
        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Le panier est vide.' });
        }

        // Calculer le total du panier (montant total)
        const totalAmount = cart.items.reduce((acc, item) => {
            // Si productId ou price absent, on protège le calcul
            const price = item.productId?.price || 0;
            return acc + price * item.quantity;
        }, 0);

        // Créer un paiement avec Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100), // Montant en centimes (Stripe attend un entier)
            currency: 'usd',
        });

        // Retourner le client secret à la frontend
        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err) {
        console.error('Erreur paiement:', err);
        res.status(500).json({ message: 'Erreur lors du traitement du paiement.' });
    }
});

module.exports = router;
