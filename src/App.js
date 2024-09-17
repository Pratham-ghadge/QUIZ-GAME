import React, { useState, useEffect } from 'react';

// This would typically be loaded from an external JSON file
const questionsData = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris"
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Mars", "Venus", "Jupiter", "Saturn"],
    correctAnswer: "Mars"
  },
  {
    id: 3,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet"],
    correctAnswer: "Leonardo da Vinci"
  }
];

const App = () => {
  const [stage, setStage] = useState('registration');
  const [name, setName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Load questions
    setQuestions(questionsData);
    // Load leaderboard from local storage
    const storedLeaderboard = JSON.parse(localStorage.getItem('quizLeaderboard') || '[]');
    setLeaderboard(storedLeaderboard);
  }, []);

  const handleStartQuiz = () => {
    if (name.trim()) {
      setStage('quiz');
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const newLeaderboard = [...leaderboard, { name, score: score + (selectedAnswer === questions[currentQuestionIndex].correctAnswer ? 1 : 0) }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    setLeaderboard(newLeaderboard);
    localStorage.setItem('quizLeaderboard', JSON.stringify(newLeaderboard));
    setStage('results');
  };

  const handlePlayAgain = () => {
    setName('');
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setScore(0);
    setStage('registration');
  };

  const renderStage = () => {
    switch (stage) {
      case 'registration':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Welcome to the Quiz Game!</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={handleStartQuiz}
              className="mt-4 w-full bg-cyan-500 text-white py-2 px-4 rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
            >
              Start Quiz
            </button>
          </div>
        );
      case 'quiz':
        const currentQuestion = questions[currentQuestionIndex];
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Question {currentQuestionIndex + 1} of {questions.length}</h2>
            <p className="font-semibold mb-4">{currentQuestion.question}</p>
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="block mb-2">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => handleAnswerSelect(option)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
            <button
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
              className="mt-4 w-full bg-cyan-500 text-white py-2 px-4 rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 disabled:bg-gray-300"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          </div>
        );
      case 'results':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
            <p className="mb-4">Your score: {score} out of {questions.length}</p>
            <h3 className="text-xl font-semibold mb-2">Leaderboard:</h3>
            <ul className="list-decimal list-inside mb-4">
              {leaderboard.map((entry, index) => (
                <li key={index} className="mb-1">
                  {entry.name}: {entry.score}
                </li>
              ))}
            </ul>
            <button
              onClick={handlePlayAgain}
              className="w-full bg-cyan-500 text-white py-2 px-4 rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
            >
              Play Again
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                {renderStage()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;