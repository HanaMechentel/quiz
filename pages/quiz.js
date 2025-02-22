import { useState, useEffect } from 'react';
import styles from '../styles/quiz.module.css';

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [disabledOptions, setDisabledOptions] = useState(false);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [askedIds, setAskedIds] = useState([]);

  const fetchQuestions = async (diff) => {
    const res = await fetch(`/api/questions?difficulty=${diff}`);
    const data = await res.json();
    return data;
  };

  const loadQuestion = async () => {
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
    }
  };

  useEffect(() => {
    loadQuestion();
  }, [difficulty]);

  const checkAnswer = (selected) => {
    setSelectedAnswer(selected);
    setDisabledOptions(true);
    if (selected === currentQuestion.answer) {
      setScore(score + 1);
      if (difficulty < 3) setDifficulty(difficulty + 1);
    } else {
      if (difficulty > 1) setDifficulty(difficulty - 1);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quiz</h1>
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
          <button onClick={loadQuestion} className={styles.nextButton} disabled={!selectedAnswer}>
            Suivant
          </button>
          <p id="score">Score: {score}</p>
        </div>
      ) : (
        <p>Chargement des questions...</p>
      )}
    </div>
  );
}
