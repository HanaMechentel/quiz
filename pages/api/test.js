import { connectToDB } from "../../utils/database";

export default async function handler(req, res) {
  try {
    await connectToDB();
    console.log("🟢 API test : Connexion réussie !");
    res.status(200).json({ message: "✅ Connexion MongoDB réussie !" });
  } catch (error) {
    console.error("🔴 API test : Erreur de connexion MongoDB", error);
    res.status(500).json({ message: "❌ Erreur de connexion MongoDB", error: error.message });
  }
}
