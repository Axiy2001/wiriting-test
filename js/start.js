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

async function getTaskFromServer() {
   try {
      const response = await fetch("/.netlify/functions/get-task");
      const task = await response.json();
      return task;
   } catch (error) {
      console.log("Get task error:", error);
      return null;
   }
}

startForm.addEventListener("submit", async function (event) {
   event.preventDefault();

   const userName = userNameInput.value.trim();
   const writingTask = await getTaskFromServer();

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