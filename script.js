let allQuestions = [];
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let mistakes = [];
let startTime = null;

fetch('questions_with_subject.json')
  .then(response => response.json())
  .then(data => {
    allQuestions = data;
    populateSubjects();
  });

const subjectSelection = document.getElementById("subject-selection");
const subjectSelect = document.getElementById("subject-select");
const startBtn = document.getElementById("start-btn");

const quizContainer = document.getElementById("quiz-container");
const questionEl = document.getElementById("question");
const answersForm = document.getElementById("answers-form");
const submitBtn = document.getElementById("submit-btn");
const feedbackEl = document.getElementById("feedback");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const recapEl = document.getElementById("recap");
const timeEl = document.getElementById("time");
const restartBtn = document.getElementById("restart-btn");
const questionImage = document.getElementById("question-image");

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function populateSubjects() {
  const subjects = [...new Set(allQuestions.map(q => q.subject))];
  subjectSelect.innerHTML = "";
  subjects.forEach(subject => {
    const option = document.createElement("option");
    option.value = subject;
    option.textContent = subject;
    subjectSelect.appendChild(option);
  });
}

startBtn.addEventListener("click", () => {
  const selectedSubject = subjectSelect.value;
  let filteredQuestions = allQuestions.filter(q => q.subject === selectedSubject);

  // Prendre 20 questions aléatoires maximum
  if (filteredQuestions.length > 20) {
    filteredQuestions = shuffleArray(filteredQuestions).slice(0, 20);
  }

  questions = filteredQuestions;
  currentQuestionIndex = 0;
  score = 0;
  mistakes = [];
  startTime = new Date(); // Lancer le chrono
  subjectSelection.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  loadQuestion();
});

function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionEl.textContent = currentQuestion.question;
  answersForm.innerHTML = "";

  if (currentQuestion.image && currentQuestion.image !== "") {
    questionImage.src = currentQuestion.image;
    questionImage.classList.remove("hidden");
  } else {
    questionImage.classList.add("hidden");
  }

  const shuffledOptions = currentQuestion.options.map((opt, idx) => ({opt, idx}));
  shuffleArray(shuffledOptions);

  shuffledOptions.forEach(({opt, idx}) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "answer";
    checkbox.value = idx;
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(opt));
    answersForm.appendChild(label);
  });

  feedbackEl.textContent = "";
}

submitBtn.addEventListener("click", () => {
  const selectedOptions = Array.from(
    document.querySelectorAll('input[name="answer"]:checked')
  ).map((checkbox) => parseInt(checkbox.value));

  const currentQuestion = questions[currentQuestionIndex];
  const correctAnswers = currentQuestion.correctAnswers;

  const isCorrect =
    selectedOptions.length === correctAnswers.length &&
    selectedOptions.every((val) => correctAnswers.includes(val));

  if (isCorrect) {
    score++;
    feedbackEl.textContent = "Bonne réponse !";
    feedbackEl.style.color = "green";
  } else {
    mistakes.push({
      question: currentQuestion.question,
      selected: selectedOptions.map(i => currentQuestion.options[i] || "").join(", "),
      correct: correctAnswers.map(i => currentQuestion.options[i] || "").join(", ")
    });
    feedbackEl.textContent = "Mauvaise réponse.";
    feedbackEl.style.color = "red";
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    setTimeout(() => {
      loadQuestion();
    }, 1000);
  } else {
    setTimeout(() => {
      showResult();
    }, 1000);
  }
});

restartBtn.addEventListener("click", () => {
  subjectSelection.classList.remove("hidden");
  quizContainer.classList.add("hidden");
  resultEl.classList.add("hidden");
});

function showResult() {
  quizContainer.classList.add("hidden");
  resultEl.classList.remove("hidden");

  scoreEl.textContent = "Vous avez obtenu " + score + " sur " + questions.length + " bonnes réponses.";
  
  // Chronomètre
  const endTime = new Date();
  const elapsedSeconds = Math.round((endTime - startTime) / 1000);
  timeEl.textContent = "Temps total : " + elapsedSeconds + " secondes.";

  // Détail des erreurs
  recapEl.innerHTML = "<h3>Corrections :</h3>";
  mistakes.forEach(mistake => {
    recapEl.innerHTML += `
      <p><strong>Question :</strong> ${mistake.question}</p>
      <p><span style="color:red;">Votre réponse :</span> ${mistake.selected}</p>
      <p><span style="color:green;">Bonne réponse :</span> ${mistake.correct}</p>
      <hr>
    `;
  });
}
