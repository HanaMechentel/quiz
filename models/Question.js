import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [String],
  answer: { type: String, required: true },
  difficulty: { type: Number, required: true }
});

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

export default Question;
