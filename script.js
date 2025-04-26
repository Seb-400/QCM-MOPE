let allQuestions = [];
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

fetch('questions_with_subject.json')
  .then(response => response.json())
  .then(data => {
    console.log("Données chargées :", data);
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
const restartBtn = document.getElementById("restart-btn");
const questionImage = document.getElementById("question-image");

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
  questions = allQuestions.filter(q => q.subject === selectedSubject);
  currentQuestionIndex = 0;
  score = 0;
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

  currentQuestion.options.forEach((option, index) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "answer";
    checkbox.value = index;
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(option));
    answersForm.appendChild(label);
  });

  feedbackEl.textContent = "";
}

submitBtn.addEventListener("click", () => {
  const selectedOptions = Array.from(
    document.querySelectorAll('input[name="answer"]:checked')
  ).map((checkbox) => parseInt(checkbox.value));

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect =
    selectedOptions.length === currentQuestion.correctAnswers.length &&
    selectedOptions.every((val) => currentQuestion.correctAnswers.includes(val));

  if (isCorrect) {
    score++;
    feedbackEl.textContent = "Bonne réponse !";
    feedbackEl.style.color = "green";
  } else {
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
}
