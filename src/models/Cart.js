const mongoose = require('mongoose');

// Définition du schéma
const CardsSchema = new mongoose.Schema({
    // Ici, tu définis les champs que ton modèle Cart va utiliser
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Référence à l'utilisateur si tu en as un
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Référence à un produit si tu en as un
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Création du modèle Cart
const Cart = mongoose.model('Cart', CardsSchema);

module.exports = Cart;
