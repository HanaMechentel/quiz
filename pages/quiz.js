import { useState, useEffect } from 'react';
import styles from '../styles/quiz.module.css';

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [disabledOptions, setDisabledOptions] = useState(false);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [askedIds, setAskedIds] = useState([]);
  const [questionCount, setQuestionCount] = useState(1);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answerChecked, setAnswerChecked] = useState(false);
  const TOTAL_QUESTIONS = 4;

  const fetchQuestions = async (diff) => {
    const res = await fetch(`/api/questions?difficulty=${diff}`);
    const data = await res.json();
    return data;
  };

  const loadQuestion = async () => {
    if (questionCount >= TOTAL_QUESTIONS) {
      setQuizFinished(true);
      return;
    }

    const questions = await fetchQuestions(difficulty);
    if (questions && questions.length > 0) {
      const filtered = questions.filter(q => !askedIds.includes(q._id));
      let chosen;
      if (filtered.length === 0) {
        setAskedIds([]);
        chosen = questions[Math.floor(Math.random() * questions.length)];
      } else {
        chosen = filtered[Math.floor(Math.random() * filtered.length)];
      }
      setCurrentQuestion(chosen);
      setAskedIds(prev => [...prev, chosen._id]);
      setSelectedAnswer(null);
      setDisabledOptions(false);
      setAnswerChecked(false);
    }
  };

  useEffect(() => {
    loadQuestion();
  }, []); 

  const checkAnswer = (selected) => {
    setSelectedAnswer(selected);
    setDisabledOptions(true);
    setAnswerChecked(true);

    if (selected === currentQuestion.answer) {
      setScore(score + 1);
      if (difficulty < 3) setDifficulty(difficulty + 1);
    } else {
      if (difficulty > 1) setDifficulty(difficulty - 1);
    }
  };

  const handleNextQuestion = () => {
    if (questionCount >= TOTAL_QUESTIONS) {
      setQuizFinished(true);
    } else {
      setQuestionCount(prev => prev + 1);
      loadQuestion();
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quiz de Polytechnique Montréal</h1>
      {quizFinished ? (
        <div className={styles.result}>
          <h2>Quiz terminé ! 🎉</h2>
          <p>Vos réponses ont bien été enregistrées.</p>
          <p>Votre score final : <strong>{score} / {TOTAL_QUESTIONS}</strong></p>
          <button onClick={() => window.location.href = "/"} className={styles.restartButton}>
            Retour à l'accueil
          </button>
        </div>
      ) : (
        <>
          {currentQuestion ? (
            <div id="quiz-container">
              <p id="question">{currentQuestion.question}</p>
              <div id="options">
                {currentQuestion.options && currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    className={`${styles.optionButton} ${selectedAnswer === option ? (option === currentQuestion.answer ? styles.correct : styles.incorrect) : ""} ${disabledOptions ? styles.disabled : ""}`}
                    onClick={() => checkAnswer(option)}
                    disabled={disabledOptions}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button onClick={handleNextQuestion} className={styles.nextButton} disabled={!answerChecked}>
                Suivant
              </button>
              <p id="score">Score: {score}</p>
              <p>Question {questionCount} / {TOTAL_QUESTIONS}</p>
            </div>
          ) : (
            <p>Chargement des questions...</p>
          )}
        </>
      )}
    </div>
  );
}
