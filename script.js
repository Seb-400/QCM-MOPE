const questions = [
  {
    question: "Quelles structures pouvons-nous trouver dans l'oreille interne ?",
    options: [
      "La pars flaccida",
      "La membrane de Reissner",
      "Le canal de Rosenthal",
      "Le canal de Fallope"
    ],
    correctAnswers: [1, 2]
  },
  {
    question: "La voie afférente auditive possède :",
    options: [
      "Toutes les réponses sont justes.",
      "L’information atteint les deux côtés du cortex.",
      "Les fibres ascendantes sont homolatérales et controlatérales.",
      "Un traitement monaural et binaural."
    ],
    correctAnswers: [0]
  }
];

let currentQuestionIndex = 0;
let score = 0;

const questionEl = document.getElementById("question");
const answersForm = document.getElementById("answers-form");
const submitBtn = document.getElementById("submit-btn");
const feedbackEl = document.getElementById("feedback");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");

function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionEl.textContent = currentQuestion.question;
  answersForm.innerHTML = "";

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
  currentQuestionIndex = 0;
  score = 0;
  resultEl.classList.add("hidden");
  document.getElementById("quiz-container").classList.remove("hidden");
  loadQuestion();
});

function showResult() {
  document.getElementById("quiz-container").classList.add("hidden");
  resultEl.classList.remove("hidden");
  scoreEl.textContent = "Vous avez obtenu " + score + " sur " + questions.length + " bonnes réponses.";
}

loadQuestion();