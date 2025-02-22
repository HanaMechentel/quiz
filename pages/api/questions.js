import { connectToDB } from '../../utils/database';
import Question from '../../models/Question';

export default async function handler(req, res) {
  await connectToDB();  

  if (req.method === 'GET') {
    try {
      console.log("🔍 Requête GET reçue, récupération des questions...");

      const difficulty = req.query.difficulty ? parseInt(req.query.difficulty) : 1;
      const questions = await Question.find({ difficulty: difficulty });

      if (!questions || questions.length === 0) {
        return res.status(404).json({ message: '⚠️ Aucune question trouvée pour cette difficulté.' });
      }

      console.log(`✅ ${questions.length} questions récupérées avec difficulté ${difficulty}`);
      res.status(200).json(questions);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des questions:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}
