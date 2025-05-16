const mongoose = require('mongoose');

const mongodbConnexion = async () => {
    try {
await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connexion réussie à MongoDB Atlas");
    } catch (error) {
        console.error("❌ Erreur lors de la connexion à MongoDB :", error.message);
        process.exit(1); // quitte le process si échec
    }
};

module.exports = mongodbConnexion;
