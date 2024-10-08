

import electronics from "../src/assets/electronics-bg.jpg"

import React, { useState, useEffect } from 'react';

const API_URL = 'https://quiz-backend-eta-seven.vercel.app/api';

const questionsData = [
  {
    id: 1,
    question: "Which IC is used for the AND gate in TTL logic?",
    options: ["7400", "7408", "7432", "7486"],
    correctAnswer: "7408"
  },
  {
    id: 2,
    question: "Which TTL gate outputs high only when both inputs are low?",
    options: ["NAND", "NOR", "XOR", "OR"],
    correctAnswer: "NOR"
  },
  {
    id: 3,
    question: "What does the 7400 IC represent?",
    options: ["AND Gate", "OR Gate", "NAND Gate", "XOR Gate"],
    correctAnswer: "NAND Gate"
  },
  {
    id: 4,
    question: "Which component is essential for error detection in digital circuits?",
    options: ["XOR Gate", "AND Gate", "NOR Gate", "NOT Gate"],
    correctAnswer: "XOR Gate"
  },
  {
    id: 5,
    question: "Which logic gate is the backbone of flip-flops and memory circuits?",
    options: ["AND", "NAND", "OR", "NOR"],
    correctAnswer: "NAND"
  },
  {
    id: 6,
    question: "What is the main application of the full-adder?",
    options: ["Subtraction", "Multiplication", "Division", "Binary Addition"],
    correctAnswer: "Binary Addition"
  },
  {
    id: 7,
    question: "How many XOR gates are needed to build a full-adder using TTL?",
    options: ["1", "2", "3", "4"],
    correctAnswer: "2"
  },
  {
    id: 8,
    question: "In TTL circuits, what is the role of BJTs?",
    options: ["To filter noise", "To amplify power", "To switch signals", "To stabilize voltage"],
    correctAnswer: "To switch signals"
  },
  
  {
    id: 9,
    question: "What is the main function of TTL logic in digital circuits?",
    options: ["Signal amplification", "Signal generation", "Logic switching", "Signal filtering"],
    correctAnswer: "Logic switching"
  },
  {
    id: 10,
    question: "Which combination of gates is used to form the carry-out in a full-adder using TTL?",
    options: ["2 AND gates and 1 XOR gate", "2 OR gates and 1 AND gate", "2 XOR gates and 1 OR gate", "3 AND gates and 1 OR gate"],
    correctAnswer: "3 AND gates and 1 OR gate"
  },
  {
    id: 11,
    question: "What is the output of a full-adder when A = 1, B = 1, and Cin = 1?",
    options: ["Sum = 0, Carry = 0", "Sum = 1, Carry = 0", "Sum = 0, Carry = 1", "Sum = 1, Carry = 1"],
    correctAnswer: "Sum = 1, Carry = 1"
  },
  {
    id: 12,
    question: "How does TTL differ from CMOS technology?",
    options: ["Uses diodes instead of BJTs", "Consumes more power but switches faster", "Uses MOSFETs instead of BJTs", "Consumes less power and switches slower"],
    correctAnswer: "Consumes more power but switches faster"
  },
  {
    id: 13,
    question: "What is the main characteristic of the 7408 IC in TTL circuits?",
    options: ["It is a NOT gate IC", "It is an AND gate IC", "It is an OR gate IC", "It is a XOR gate IC"],
    correctAnswer: "It is an AND gate IC"
  },
  {
    id: 14,
    question: "How many gates are typically used to build a full-adder circuit?",
    options: ["3 gates", "4 gates", "5 gates", "6 gates"],
    correctAnswer: "6 gates"
  },
  {
    id: 15,
    question: "How does a full-adder handle the carry from previous additions?",
    options: ["Uses the sum output", "Uses a dedicated carry-in input", "Ignores the carry", "Generates a random output"],
    correctAnswer: "Uses a dedicated carry-in input"
  },
  
  
];

// Fisher-Yates shuffle algorithm
const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const App = () => {
  const [stage, setStage] = useState('registration');
  const [name, setName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const shuffledQuestions = shuffleArray([...questionsData]);
    setQuestions(shuffledQuestions);
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/leaderboard`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLeaderboard(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to fetch leaderboard. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = () => {
    if (name.trim()) {
      setStage('quiz');
      setError(null);
    } else {
      setError('Please enter your name to start the quiz.');
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (!showAnswer) {
      setShowAnswer(true);
      if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
        setScore(score + 1);
      }
    } else {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer('');
        setShowAnswer(false);
      } else {
        finishQuiz();
      }
    }
  };

  const finishQuiz = async () => {
    const finalScore = score + (selectedAnswer === questions[currentQuestionIndex].correctAnswer ? 1 : 0);
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/leaderboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, score: finalScore }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedLeaderboard = await response.json();
      setLeaderboard(updatedLeaderboard);
      setStage('results');
      setError(null);
    } catch (error) {
      console.error('Error updating leaderboard:', error);
      setError('Failed to update leaderboard. Your score: ' + finalScore);
      setStage('results');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAgain = () => {
    setName('');
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setScore(0);
    setStage('registration');
    setError(null);
    const shuffledQuestions = shuffleArray([...questionsData]);
    setQuestions(shuffledQuestions);
    fetchLeaderboard();
  };

  const renderStage = () => {
    switch (stage) {
      case 'registration':
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4 text-black">The Quiz Battle: Are You Ready?</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            <button
              onClick={handleStartQuiz}
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Start Quiz
            </button>
          </div>
        );
      case 'quiz':
        const currentQuestion = questions[currentQuestionIndex];
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
            <p className="font-semibold mb-4 text-black">{currentQuestion.question}</p>
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`block mb-2 p-2 rounded ${
                  showAnswer
                    ? option === currentQuestion.correctAnswer
                      ? 'bg-green-200'
                      : selectedAnswer === option
                      ? 'bg-red-200'
                      : 'hover:bg-blue-100'
                    : 'hover:bg-blue-100'
                } transition ease-in duration-150 text-black`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => handleAnswerSelect(option)}
                  className="mr-2"
                  disabled={showAnswer}
                />
                {option}
              </label>
            ))}
            <button
              onClick={handleNextQuestion}
              disabled={!selectedAnswer && !showAnswer}
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-300"
            >
              {showAnswer
                ? currentQuestionIndex < questions.length - 1
                  ? 'Next Question'
                  : 'Finish Quiz'
                : 'Check Answer'}
            </button>
          </div>
        );
      case 'results':
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4 text-black">Quiz Results</h2>
            <p className="mb-4 text-black">Your score: {score} out of {questions.length}</p>
            <h3 className="text-xl font-semibold mb-2 text-black">Quiz Champions:</h3>
            {isLoading ? (
              <p className="text-black">Loading leaderboard...</p>
            ) : leaderboard.length > 0 ? (
              <ul className="list-decimal list-inside mb-4 text-black">
                {leaderboard.map((entry, index) => (
                  <li key={index} className="mb-1">
                    {entry.name}: {entry.score}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-black">No leaderboard data available.</p>
            )}
            <button
              onClick={handlePlayAgain}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
    <div className="min-h-screen bg-cover bg-center bg-no-repeat py-6 flex flex-col justify-center sm:py-12" 
          style={{ backgroundImage: `url(${electronics})` }}>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-black sm:text-lg sm:leading-7">
                {renderStage()}
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;