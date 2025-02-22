import { useState } from 'react';
import Quiz from './quiz';
import styles from '../styles/quiz.module.css';

export default function Home() {
  const [startQuiz, setStartQuiz] = useState(false);

  return (
    <div className={styles.container}>
      {startQuiz ? (
        <Quiz />
      ) : (
        <div className={styles.intro}>
          <h1>Quiz de Polytechnique Montréal</h1>
          <p>Testez vos connaissances en mathématiques avec ce quiz interactif.</p>
          <button onClick={() => setStartQuiz(true)} className={styles.startButton}>
            Commencer le Quiz
          </button>
        </div>
      )}
    </div>
  );
}
