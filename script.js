let secretCode = [];
let attempts = 0;
const maxAttempts = 10;

// الانتقال التلقائي بين الحقول
function autoFocusNext(current, nextId) {
  if (current.value.length === 1) {
    document.getElementById(nextId).focus();
  }
  
  // التأكد من أن القيمة رقمية بين 0-9
  if (!/^[0-9]$/.test(current.value)) {
    current.value = '';
  }
}

// بدء اللعبة ضد لاعب
function startPlayerVsPlayer() {
  document.getElementById("gameSelect").classList.add("hidden");
  document.getElementById("setCode").classList.remove("hidden");
  resetGame();
  document.getElementById("code1").focus();
}

// بدء اللعبة ضد حاسوب
function startPlayerVsComputer() {
  document.getElementById("gameSelect").classList.add("hidden");
  document.getElementById("computerGame").classList.remove("hidden");
  resetGame();
  
  // توليد كود عشوائي
  secretCode = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10).toString());
  console.log("الكود السري:", secretCode.join(''));
  document.getElementById("computerAttempts").textContent = attempts;
  document.getElementById("guessComputer1").focus();
}

// بدء اللعبة (ضد لاعب)
function startGame() {
  secretCode = [
    document.getElementById("code1").value,
    document.getElementById("code2").value,
    document.getElementById("code3").value,
    document.getElementById("code4").value,
  ];
  
  if (secretCode.some(code => !code)) {
    alert("الرجاء إدخال كود سري مكون من 4 أرقام!");
    return;
  }
  
  document.getElementById("setCode").classList.add("hidden");
  document.getElementById("guessCode").classList.remove("hidden");
  document.getElementById("playerAttempts").textContent = attempts;
  document.getElementById("guess1").focus();
}

// التحقق من التخمين
function checkGuess(isAgainstComputer = false) {
  const guessPrefix = isAgainstComputer ? "guessComputer" : "guess";
  const feedbackId = isAgainstComputer ? "computerFeedback" : "playerFeedback";
  const attemptsId = isAgainstComputer ? "computerAttempts" : "playerAttempts";
  const restartButtonId = isAgainstComputer ? "computerRestartButton" : "playerRestartButton";
  
  attempts++;
  document.getElementById(attemptsId).textContent = attempts;
  
  const guess = [
    document.getElementById(`${guessPrefix}1`).value,
    document.getElementById(`${guessPrefix}2`).value,
    document.getElementById(`${guessPrefix}3`).value,
    document.getElementById(`${guessPrefix}4`).value,
  ];

  if (guess.some(code => !code)) {
    alert("الرجاء إدخال تخمين مكون من 4 أرقام!");
    attempts--;
    document.getElementById(attemptsId).textContent = attempts;
    return;
  }

  const feedback = [];
  let secretCodeCopy = [...secretCode];
  let correctPositions = 0;

  // التحقق من الأرقام الصحيحة في المكان الصحيح
  for (let i = 0; i < 4; i++) {
    if (guess[i] === secretCode[i]) {
      feedback.push({ type: "correct", value: guess[i] });
      secretCodeCopy[i] = null;
      correctPositions++;
    } else {
      feedback.push({ type: "none", value: guess[i] });
    }
  }

  // التحقق من الأرقام الصحيحة في المكان الخطأ
  for (let i = 0; i < 4; i++) {
    if (feedback[i].type === "none" && secretCodeCopy.includes(guess[i])) {
      feedback[i].type = "misplaced";
      secretCodeCopy[secretCodeCopy.indexOf(guess[i])] = null;
    } else if (feedback[i].type === "none") {
      feedback[i].type = "incorrect";
    }
  }

  // عرض النتيجة
  const feedbackDiv = document.getElementById(feedbackId);
  feedbackDiv.innerHTML = "";
  
  feedback.forEach(item => {
    const feedbackElement = document.createElement("div");
    feedbackElement.className = `feedback-item ${item.type}`;
    feedbackElement.textContent = item.value;
    feedbackDiv.appendChild(feedbackElement);
  });

  // التحقق من الفوز أو انتهاء المحاولات
  if (correctPositions === 4) {
    showResult(true, isAgainstComputer);
    document.getElementById(restartButtonId).classList.remove("hidden");
  } else if (attempts >= maxAttempts) {
    showResult(false, isAgainstComputer);
    document.getElementById(restartButtonId).classList.remove("hidden");
  }

  // مسح الحقول
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`${guessPrefix}${i}`).value = "";
  }
  document.getElementById(`${guessPrefix}1`).focus();
}

// عرض نتيجة اللعبة
function showResult(isWin, isAgainstComputer) {
  const message = isWin 
    ? `مبروك! لقد فزت بعد ${attempts} محاولات${attempts > 1 ? 'ات' : ''}!` 
    : `انتهت المحاولات! الكود الصحيح كان: ${secretCode.join('')}`;
  
  const feedbackId = isAgainstComputer ? "computerFeedback" : "playerFeedback";
  const feedbackDiv = document.getElementById(feedbackId);
  
  const resultElement = document.createElement("div");
  resultElement.className = "result-message";
  resultElement.textContent = message;
  resultElement.style.fontWeight = "bold";
  resultElement.style.margin = "10px 0";
  resultElement.style.color = isWin ? "var(--secondary-color)" : "var(--accent-color)";
  
  feedbackDiv.prepend(resultElement);
}

// إعادة اللعبة
function restartGame() {
  resetGame();
  backToMenu();
}

// العودة للقائمة الرئيسية
function backToMenu() {
  document.getElementById("gameSelect").classList.remove("hidden");
  document.getElementById("setCode").classList.add("hidden");
  document.getElementById("guessCode").classList.add("hidden");
  document.getElementById("computerGame").classList.add("hidden");
  document.getElementById("computerRestartButton").classList.add("hidden");
  document.getElementById("playerRestartButton").classList.add("hidden");
}

// إعادة تعيين اللعبة
function resetGame() {
  attempts = 0;
  secretCode = [];
  document.getElementById("computerAttempts").textContent = "0";
  document.getElementById("playerAttempts").textContent = "0";
  document.getElementById("computerFeedback").innerHTML = "";
  document.getElementById("playerFeedback").innerHTML = "";
  
  // مسح جميع الحقول
  const inputs = document.querySelectorAll(".simple-input input");
  inputs.forEach(input => input.value = "");
}