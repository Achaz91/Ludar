// Variables globales
let selectedOperation = "addition";
let currentOperand1 = 0;
let currentOperand2 = 0;
let currentAnswer = 0;

// Pour suivre le taux de réussite sur la 1ʳᵉ tentative
let totalQuestions = 0;
let correctOnFirstAttempt = 0;
let currentFirstAttempt = true;

// Pour le suivi du temps (en minutes)
let startTime = 0;
let timerInterval;

// Démarre la pratique en récupérant l'opération choisie et en initialisant le suivi
function startPractice() {
  selectedOperation = document.getElementById("operationSelect").value;
  
  // Réinitialisation des variables de performance
  totalQuestions = 0;
  correctOnFirstAttempt = 0;
  updatePerformance();
  
  // Masque le panneau de sélection et affiche le quiz
  document.getElementById("controlPanel").style.display = "none";
  document.getElementById("quizSection").style.display = "block";
  
  // Démarre le timer
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
  
  newQuestion();
}

// Met à jour l'affichage du temps écoulé en minutes
function updateTimer() {
  const minutesElapsed = Math.floor((Date.now() - startTime) / 60000);
  document.getElementById("timeDisplay").innerText = `Temps: ${minutesElapsed} minutes`;
}

// Génère une nouvelle question en fonction de l'opération choisie
function newQuestion() {
  document.getElementById("feedback").innerText = "";
  totalQuestions++;
  currentFirstAttempt = true;
  
  // En fonction du type d'opération, on génère deux nombres et on calcule la réponse.
  // Les plages de nombres ont été choisies pour simplifier l'apprentissage des enfants.
  switch (selectedOperation) {
    case "addition":
      currentOperand1 = Math.floor(Math.random() * 21); // entre 0 et 20
      currentOperand2 = Math.floor(Math.random() * 21);
      currentAnswer = currentOperand1 + currentOperand2;
      displayQuestion(`${currentOperand1} + ${currentOperand2} = ?`);
      break;
    case "soustraction":
      currentOperand1 = Math.floor(Math.random() * 21);
      currentOperand2 = Math.floor(Math.random() * 21);
      if (currentOperand1 < currentOperand2)[currentOperand1, currentOperand2] = [currentOperand2, currentOperand1];
      currentAnswer = currentOperand1 - currentOperand2;
      displayQuestion(`${currentOperand1} - ${currentOperand2} = ?`);
      break;
    case "multiplication":
      currentOperand1 = Math.floor(Math.random() * 11); // entre 0 et 10
      currentOperand2 = Math.floor(Math.random() * 11);
      currentAnswer = currentOperand1 * currentOperand2;
      displayQuestion(`${currentOperand1} × ${currentOperand2} = ?`);
      break;
    case "division":
      currentOperand2 = Math.floor(Math.random() * 10) + 1; // divisor de 1 à 10
      let quotient = Math.floor(Math.random() * 11); // quotient entre 0 et 10
      currentOperand1 = quotient * currentOperand2;
      currentAnswer = quotient;
      displayQuestion(`${currentOperand1} ÷ ${currentOperand2} = ?`);
      break;
    default:
      console.error("Opération inconnue");
  }
  
  // Génère les choix multiples : la bonne réponse + 3 fausses réponses
  generateChoices();
  updatePerformance();
}

// Affiche la question dans l'élément dédié
function displayQuestion(text) {
  document.getElementById("questionArea").innerText = text;
}

// Génère et affiche les boutons de réponse
function generateChoices() {
  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";
  let choicesArray = [];
  
  choicesArray.push(currentAnswer);
  
  while (choicesArray.length < 4) {
    let fake = currentAnswer + Math.floor(Math.random() * 11) - 5;
    if (fake < 0) fake = Math.abs(fake) + 1;
    if (fake === currentAnswer || choicesArray.includes(fake)) continue;
    choicesArray.push(fake);
  }
  
  // Mélange les choix aléatoirement
  choicesArray.sort(() => Math.random() - 0.5);
  
  choicesArray.forEach(ans => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.innerText = ans;
    btn.onclick = () => checkAnswer(ans, btn);
    choicesContainer.appendChild(btn);
  });
  
  // Cache le bouton "Question Suivante"
  document.getElementById("nextBtn").style.display = "none";
}

// Vérifie la réponse sélectionnée et met à jour le taux de réussite
function checkAnswer(selected, btn) {
  const feedbackElem = document.getElementById("feedback");
  const correctSound = document.getElementById("correctSound");
  const incorrectSound = document.getElementById("incorrectSound");
  
  if (selected === currentAnswer) {
    if (currentFirstAttempt) correctOnFirstAttempt++;
    feedbackElem.innerText = "Bravo ! Correct !";
    feedbackElem.style.color = "green";
    if (correctSound) correctSound.play();
    // Désactive tous les boutons de choix
    document.querySelectorAll(".choice-btn").forEach(b => b.disabled = true);
    // Affiche le bouton pour la question suivante
    document.getElementById("nextBtn").style.display = "inline-block";
  } else {
    feedbackElem.innerText = "Incorrect, essaie encore !";
    feedbackElem.style.color = "red";
    if (incorrectSound) incorrectSound.play();
    // Désactive ce bouton
    btn.disabled = true;
    currentFirstAttempt = false;
  }
  updatePerformance();
}

// Met à jour l'affichage du taux de réussite et du nombre de calculs effectués
function updatePerformance() {
  let rate = totalQuestions > 0 ? Math.round((correctOnFirstAttempt / totalQuestions) * 100) : 0;
  document.getElementById("performanceDisplay").innerText = `Taux de Réussite: ${rate}%`;
  document.getElementById("calcCountDisplay").innerText = `Calculs effectués: ${totalQuestions}`;
}

// Permet de revenir au panneau de sélection d'opération et arrête le timer
function changeOperation() {
  clearInterval(timerInterval);
  document.getElementById("quizSection").style.display = "none";
  document.getElementById("controlPanel").style.display = "block";
}

// Initialisation à l'ouverture de la page
window.onload = () => {
  document.getElementById("controlPanel").style.display = "block";
};
