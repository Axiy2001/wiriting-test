const task = getFromStorage(STORAGE_KEYS.writingTask);
const user = getFromStorage(STORAGE_KEYS.currentUser);

const titleEl = document.getElementById("taskTitle");
const instructionEl = document.getElementById("taskInstruction");
const questionEl = document.getElementById("taskQuestion");
const imageEl = document.getElementById("taskImage");

const userNameEl = document.getElementById("userName");
const timerEl = document.getElementById("timer");

const answerBox = document.getElementById("answerBox");
const wordCountEl = document.getElementById("wordCount");
const submitBtn = document.getElementById("submitBtn");

let timeLeft = task.duration * 60;
let timerInterval;

initExam();

function initExam() {

   if (!task || !user) {
      alert("Exam data missing");
      window.location.href = "./index.html";
      return;
   }

   titleEl.textContent = task.title;
   instructionEl.textContent = task.instruction;
   questionEl.textContent = task.question;

   userNameEl.textContent = user.name;

   if (task.image) {
      imageEl.src = task.image;
   }

   startTimer();
}

function startTimer() {

   timerInterval = setInterval(() => {

      timeLeft--;

      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;

      timerEl.textContent =
         `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

      if (timeLeft <= 0) {
         clearInterval(timerInterval);
         submitExam(true);
      }

   }, 1000);

}

answerBox.addEventListener("input", () => {

   const text = answerBox.value.trim();

   const words = text === ""
      ? 0
      : text.split(/\s+/).length;

   wordCountEl.textContent = `Words: ${words}`;

   saveDraft(text);

});

function saveDraft(text) {

   const draft = {
      text: text,
      remaining: timeLeft
   };

   saveToStorage(STORAGE_KEYS.draftAnswer, draft);

}

submitBtn.addEventListener("click", () => {
   submitExam(false);
});

async function submitExam(auto = false) {

   clearInterval(timerInterval);

   const answer = answerBox.value;

   const submission = {

      name: user.name,

      title: task.title,

      answer: answer,

      autoSubmitted: auto,

      timeUsed:
         (task.duration * 60 - timeLeft)

   };

   saveToStorage(STORAGE_KEYS.lastSubmission, submission);

   await sendToTelegram(submission);

   removeFromStorage(STORAGE_KEYS.draftAnswer);

   window.location.href = "./result.html";

}

async function sendToTelegram(data) {
   try {
      const response = await fetch("/.netlify/functions/send-to-telegram", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log("Telegram response:", result);

      return result;
   } catch (error) {
      console.log("Telegram error:", error);
   }
}