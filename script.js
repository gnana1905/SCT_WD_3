/**
 * Interactive Web Development Quiz Game
 * Pure Vanilla JavaScript implementation
 */

// --------------------------------------------------------------------------
// Question Data Bank (10 High-Quality Web Development Questions)
// --------------------------------------------------------------------------
const QUESTION_BANK = [
  {
    q: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "Hyper Tool Multi Language",
      "Hyperlink and Text Model Language"
    ],
    answer: 0
  },
  {
    q: "What is CSS primarily used for on the web?",
    options: [
      "Managing database transactions",
      "Styling and formatting web pages",
      "Handling server-side logic",
      "Compiling machine instructions"
    ],
    answer: 1
  },
  {
    q: "Which of the following best describes JavaScript?",
    options: [
      "A dynamic programming language for interactive web behavior",
      "A relational database management tool",
      "A stylesheet preprocessor",
      "A server hardware specification"
    ],
    answer: 0
  },
  {
    q: "Which HTML tag is used to create a hyperlink?",
    options: ["<a>", "<link>", "<href>", "<hyperlink>"],
    answer: 0
  },
  {
    q: "Which company originally created the JavaScript language in 1995?",
    options: ["Netscape", "Google", "Apple", "Microsoft"],
    answer: 0
  },
  {
    q: "Which CSS property is used to set the text color of an element?",
    options: ["font-color", "color", "text-color", "text-style"],
    answer: 1
  },
  {
    q: "What does DOM stand for in modern web development?",
    options: [
      "Document Object Model",
      "Data Operation Middleware",
      "Desktop Oriented Module",
      "Digital Output Method"
    ],
    answer: 0
  },
  {
    q: "Which of the following is a popular responsive CSS framework?",
    options: ["Bootstrap", "Express.js", "Django", "MySQL"],
    answer: 0
  },
  {
    q: "What is the standard file extension for JavaScript source files?",
    options: [".js", ".java", ".jscript", ".ts"],
    answer: 0
  },
  {
    q: "Which modern CSS feature is used to build responsive layouts for various screen sizes?",
    options: ["Media Queries", "SQL Queries", "JSON Schemas", "PHP Tags"],
    answer: 0
  }
];

const TIMER_SECONDS = 15;

// --------------------------------------------------------------------------
// Application State
// --------------------------------------------------------------------------
let state = {
  selectedQuestionCount: 10,
  activeQuestions: [],
  currentIndex: 0,
  score: 0,
  timeRemaining: TIMER_SECONDS,
  timerInterval: null,
  isAnswered: false
};

// --------------------------------------------------------------------------
// DOM Elements
// --------------------------------------------------------------------------
const dom = {
  // Screens
  startScreen: document.getElementById("start-screen"),
  quizScreen: document.getElementById("quiz-screen"),
  resultScreen: document.getElementById("result-screen"),

  // Start Screen Elements
  pillBtns: document.querySelectorAll(".pill-btn"),
  startBtn: document.getElementById("start-btn"),
  startBestScore: document.getElementById("start-best-score"),
  startBestScoreVal: document.getElementById("start-best-score-val"),

  // Quiz Screen Elements
  questionTracker: document.getElementById("question-tracker"),
  timerBadge: document.getElementById("timer-badge"),
  timerDisplay: document.getElementById("timer-display"),
  progressBar: document.getElementById("progress-bar"),
  questionText: document.getElementById("question-text"),
  answersContainer: document.getElementById("answers-container"),
  feedbackHint: document.getElementById("feedback-hint"),
  nextBtn: document.getElementById("next-btn"),

  // Result Screen Elements
  resultIcon: document.getElementById("result-icon"),
  resultTitle: document.getElementById("result-title"),
  resultFeedback: document.getElementById("result-feedback"),
  finalScoreVal: document.getElementById("final-score-val"),
  finalTotalVal: document.getElementById("final-total-val"),
  finalPercentVal: document.getElementById("final-percent-val"),
  statCorrect: document.getElementById("stat-correct"),
  statWrong: document.getElementById("stat-wrong"),
  statBest: document.getElementById("stat-best"),
  restartBtn: document.getElementById("restart-btn"),
  homeBtn: document.getElementById("home-btn")
};

// --------------------------------------------------------------------------
// Screen Navigation Helper
// --------------------------------------------------------------------------
function switchScreen(targetScreen) {
  [dom.startScreen, dom.quizScreen, dom.resultScreen].forEach(screen => {
    screen.classList.add("hidden");
    screen.classList.remove("fade-in");
  });

  targetScreen.classList.remove("hidden");
  void targetScreen.offsetWidth; // Force CSS reflow to re-trigger animation
  targetScreen.classList.add("fade-in");
}

// --------------------------------------------------------------------------
// Storage Helpers (Best Score)
// --------------------------------------------------------------------------
function getBestScore() {
  const saved = localStorage.getItem("quiz_best_percent");
  return saved !== null ? parseInt(saved, 10) : null;
}

function updateStartBestScoreUI() {
  const best = getBestScore();
  if (best !== null) {
    dom.startBestScore.classList.remove("hidden");
    dom.startBestScoreVal.textContent = `${best}%`;
  } else {
    dom.startBestScore.classList.add("hidden");
  }
}

// --------------------------------------------------------------------------
// Quiz Initialization & Flow
// --------------------------------------------------------------------------
function startQuiz() {
  state.score = 0;
  state.currentIndex = 0;
  state.activeQuestions = QUESTION_BANK.slice(0, state.selectedQuestionCount);

  switchScreen(dom.quizScreen);
  loadQuestion();
}

function loadQuestion() {
  clearInterval(state.timerInterval);
  state.isAnswered = false;

  const currentQ = state.activeQuestions[state.currentIndex];
  const total = state.activeQuestions.length;
  const currentNum = state.currentIndex + 1;

  // Update Question Counter & Progress Bar
  dom.questionTracker.textContent = `Question ${currentNum} of ${total}`;
  const progressPercent = ((currentNum - 1) / total) * 100;
  dom.progressBar.style.width = `${progressPercent}%`;

  // Update Question Text
  dom.questionText.textContent = currentQ.q;

  // Clear previous options & feedback
  dom.answersContainer.innerHTML = "";
  dom.feedbackHint.className = "feedback-hint";
  dom.feedbackHint.innerHTML = "<span>Select an answer to continue</span>";

  // Hide Next Button until user selects an answer
  dom.nextBtn.classList.add("hidden");
  if (currentNum === total) {
    dom.nextBtn.innerHTML = `View Results <span class="btn-arrow" aria-hidden="true">&rarr;</span>`;
  } else {
    dom.nextBtn.innerHTML = `Next Question <span class="btn-arrow" aria-hidden="true">&rarr;</span>`;
  }

  // Render Option Buttons
  const optionLetters = ["A", "B", "C", "D"];
  currentQ.options.forEach((optionText, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.setAttribute("data-index", idx);
    btn.setAttribute("aria-label", `Option ${optionLetters[idx]}: ${optionText}`);

    btn.innerHTML = `
      <span class="option-letter">${optionLetters[idx]}</span>
      <span class="option-text">${optionText}</span>
      <span class="option-icon" aria-hidden="true"></span>
    `;

    btn.addEventListener("click", () => handleSelectAnswer(btn, idx));
    dom.answersContainer.appendChild(btn);
  });

  // Start Timer for this question
  startTimer();
}

// --------------------------------------------------------------------------
// Timer Logic
// --------------------------------------------------------------------------
function startTimer() {
  state.timeRemaining = TIMER_SECONDS;
  updateTimerUI();

  state.timerInterval = setInterval(() => {
    state.timeRemaining--;
    updateTimerUI();

    if (state.timeRemaining <= 0) {
      clearInterval(state.timerInterval);
      handleTimeOut();
    }
  }, 1000);
}

function updateTimerUI() {
  dom.timerDisplay.textContent = `${state.timeRemaining}s`;

  if (state.timeRemaining <= 5) {
    dom.timerBadge.classList.add("timer-warning");
  } else {
    dom.timerBadge.classList.remove("timer-warning");
  }
}

// --------------------------------------------------------------------------
// Answer Selection & Evaluation
// --------------------------------------------------------------------------
function handleSelectAnswer(selectedBtn, selectedIndex) {
  if (state.isAnswered) return;
  state.isAnswered = true;
  clearInterval(state.timerInterval);

  const currentQ = state.activeQuestions[state.currentIndex];
  const isCorrect = selectedIndex === currentQ.answer;
  const allButtons = dom.answersContainer.querySelectorAll(".option-btn");

  // Disable all options so user cannot change answer
  allButtons.forEach(btn => (btn.disabled = true));

  if (isCorrect) {
    state.score++;
    selectedBtn.classList.add("correct");
    selectedBtn.querySelector(".option-icon").textContent = "✓";
    dom.feedbackHint.className = "feedback-hint resolved";
    dom.feedbackHint.innerHTML = `<span class="text-success">✓ Correct answer!</span>`;
  } else {
    selectedBtn.classList.add("wrong");
    selectedBtn.querySelector(".option-icon").textContent = "✕";

    // Reveal correct answer
    const correctBtn = allButtons[currentQ.answer];
    if (correctBtn) {
      correctBtn.classList.add("correct");
      correctBtn.querySelector(".option-icon").textContent = "✓";
    }

    dom.feedbackHint.className = "feedback-hint resolved";
    dom.feedbackHint.innerHTML = `<span class="text-danger">✕ Incorrect! Correct answer is highlighted in green.</span>`;
  }

  dom.nextBtn.classList.remove("hidden");
  dom.nextBtn.focus();
}

function handleTimeOut() {
  if (state.isAnswered) return;
  state.isAnswered = true;

  const currentQ = state.activeQuestions[state.currentIndex];
  const allButtons = dom.answersContainer.querySelectorAll(".option-btn");

  allButtons.forEach(btn => (btn.disabled = true));

  // Highlight the correct answer
  const correctBtn = allButtons[currentQ.answer];
  if (correctBtn) {
    correctBtn.classList.add("correct");
    correctBtn.querySelector(".option-icon").textContent = "✓";
  }

  dom.feedbackHint.className = "feedback-hint resolved";
  dom.feedbackHint.innerHTML = `<span class="text-warning">⏱️ Time's up! The correct answer is highlighted in green.</span>`;

  dom.nextBtn.classList.remove("hidden");
  dom.nextBtn.focus();
}

// --------------------------------------------------------------------------
// Next Question & Result Screen
// --------------------------------------------------------------------------
function handleNextQuestion() {
  state.currentIndex++;

  if (state.currentIndex < state.activeQuestions.length) {
    loadQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  clearInterval(state.timerInterval);
  const total = state.activeQuestions.length;
  const score = state.score;
  const percentage = Math.round((score / total) * 100);
  const wrong = total - score;

  // Complete the progress bar fill
  dom.progressBar.style.width = "100%";

  // Score overview values
  dom.finalScoreVal.textContent = score;
  dom.finalTotalVal.textContent = total;
  dom.finalPercentVal.textContent = `${percentage}%`;

  // Detailed statistics
  dom.statCorrect.textContent = score;
  dom.statWrong.textContent = wrong;

  // Determine feedback message & badge icon
  if (percentage === 100) {
    dom.resultIcon.textContent = "🏆";
    dom.resultTitle.textContent = "Flawless Victory!";
    dom.resultFeedback.textContent = "Incredible! You answered every question correctly.";
  } else if (percentage >= 80) {
    dom.resultIcon.textContent = "🌟";
    dom.resultTitle.textContent = "Outstanding Work!";
    dom.resultFeedback.textContent = "You demonstrated strong web development knowledge.";
  } else if (percentage >= 60) {
    dom.resultIcon.textContent = "👍";
    dom.resultTitle.textContent = "Good Effort!";
    dom.resultFeedback.textContent = "Solid attempt! Review the missed questions to sharpen your skills.";
  } else {
    dom.resultIcon.textContent = "💡";
    dom.resultTitle.textContent = "Keep Practicing!";
    dom.resultFeedback.textContent = "Don't worry, every developer starts here. Review the basics and try again!";
  }

  // Update Best Record in localStorage
  const currentBest = getBestScore();
  let updatedBest = currentBest === null ? percentage : Math.max(currentBest, percentage);
  localStorage.setItem("quiz_best_percent", updatedBest);
  dom.statBest.textContent = `${updatedBest}%`;

  switchScreen(dom.resultScreen);
}

// --------------------------------------------------------------------------
// Event Listeners & Setup
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Question Count Selector Pill Buttons
  dom.pillBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      dom.pillBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.selectedQuestionCount = parseInt(btn.getAttribute("data-count"), 10);
    });
  });

  // Start Button
  dom.startBtn.addEventListener("click", startQuiz);

  // Next Question Button
  dom.nextBtn.addEventListener("click", handleNextQuestion);

  // Restart Quiz Button (Restarts directly without page reload)
  dom.restartBtn.addEventListener("click", startQuiz);

  // Home / Settings Button
  dom.homeBtn.addEventListener("click", () => {
    updateStartBestScoreUI();
    switchScreen(dom.startScreen);
  });

  // Initial best score UI check
  updateStartBestScoreUI();
});
