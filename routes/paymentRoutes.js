const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/Cart');
const { protect } = require('./authRoutes');
const router = express.Router();

// Route pour démarrer le paiement (checkout)
router.post('/checkout', protect, async (req, res) => {
    try {
        // Récupérer le panier de l'utilisateur
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Le panier est vide.' });
        }

        // Calculer le total du panier (montant total)
        const totalAmount = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

        // Créer un paiement avec Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount * 100, // Montant en centimes
            currency: 'usd', // Ou la devise de ton choix
        });

        // Retourner le client secret nécessaire à la frontend pour compléter le paiement
        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors du traitement du paiement.' });
    }
});

module.exports = router;
