import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export const connectToDB = async () => {
  if (!MONGODB_URI) {
    console.error("❌ ERREUR : MONGODB_URI n'est pas défini !");
    throw new Error("MONGODB_URI n'est pas défini !");
  }

  try {
    console.log("⏳ Tentative de connexion à MongoDB...");
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connexion réussie à MongoDB !");
  } catch (error) {
    console.error("❌ ERREUR MongoDB :", error);
    throw error;
  }
};
