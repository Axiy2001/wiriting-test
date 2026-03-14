const startForm = document.getElementById("startForm");
const userNameInput = document.getElementById("userName");
const startMessage = document.getElementById("startMessage");
const adminBtn = document.getElementById("adminBtn");

const ADMIN_PASSWORD = "12345";

if (adminBtn) {
   adminBtn.addEventListener("click", () => {
      const password = prompt("Admin parolini kiriting");

      if (password === null) {
         return;
      }

      if (password === ADMIN_PASSWORD) {
         window.location.href = "./admin.html";
      } else {
         alert("Noto'g'ri parol");
      }
   });
}

function showStartMessage(text, type = "danger") {
   startMessage.textContent = text;
   startMessage.className = `message ${type}`;
}

function loadSavedUser() {
   const savedUser = getFromStorage(STORAGE_KEYS.currentUser);

   if (savedUser && savedUser.name) {
      userNameInput.value = savedUser.name;
   }
}

startForm.addEventListener("submit", function (event) {
   event.preventDefault();

   const userName = userNameInput.value.trim();
   const writingTask = getFromStorage(STORAGE_KEYS.writingTask);

   if (!userName) {
      showStartMessage("Iltimos, FIO kiriting.");
      return;
   }

   if (!writingTask) {
      showStartMessage("Task topilmadi. Iltimos, avval admin panelida task yarating.");
      return;
   }

   const currentUser = {
      name: userName,
   };

   saveToStorage(STORAGE_KEYS.currentUser, currentUser);
   window.location.href = "./exam.html";
});

loadSavedUser();