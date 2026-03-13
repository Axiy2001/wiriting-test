const submission = getFromStorage(STORAGE_KEYS.lastSubmission);

const userEl = document.getElementById("resultUser");
const titleEl = document.getElementById("resultTitle");
const timeEl = document.getElementById("resultTime");
const autoEl = document.getElementById("resultAuto");
const answerEl = document.getElementById("resultAnswer");

const backBtn = document.getElementById("backBtn");

initResult();

function initResult() {

   if (!submission) {

      alert("Yuborilgan ish topilmadi.");

      window.location.href = "./index.html";

      return;

   }

   userEl.textContent = submission.name;

   titleEl.textContent = submission.title;

   timeEl.textContent = submission.timeUsed;

   autoEl.textContent = submission.autoSubmitted
      ? "Yes"
      : "No";

   answerEl.textContent = submission.answer;

}

backBtn.addEventListener("click", () => {

   removeFromStorage(STORAGE_KEYS.currentUser);

   window.location.href = "./index.html";

});