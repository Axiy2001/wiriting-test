const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const instructionInput = document.getElementById("instruction");
const questionInput = document.getElementById("question");
const imageInput = document.getElementById("image");
const durationInput = document.getElementById("duration");
const clearTaskBtn = document.getElementById("clearTaskBtn");
const messageBox = document.getElementById("message");
const previewContent = document.getElementById("previewContent");

let selectedImageBase64 = "";

function showMessage(text, type = "success") {
   messageBox.textContent = text;
   messageBox.className = `message ${type}`;
}

function renderPreview() {
   const savedTask = getFromStorage(STORAGE_KEYS.writingTask);

   if (!savedTask) {
      previewContent.innerHTML = `<p>Task hali saqlanmadi.</p>`;
      return;
   }

   previewContent.innerHTML = `
    <h3>${savedTask.title}</h3>
    <p><strong>Instruction:</strong> ${savedTask.instruction}</p>
    <p><strong>Question:</strong> ${savedTask.question}</p>
    <p><strong>Duration:</strong> ${savedTask.duration} minutes</p>
    ${savedTask.image
         ? `<img src="${savedTask.image}" alt="Task Image" class="preview-image" />`
         : `<p><strong>Image:</strong> Rasm yuklanmadi</p>`
      }
  `;
}

function loadTaskIntoForm() {
   const savedTask = getFromStorage(STORAGE_KEYS.writingTask);

   if (!savedTask) return;

   titleInput.value = savedTask.title || "";
   instructionInput.value = savedTask.instruction || "";
   questionInput.value = savedTask.question || "";
   durationInput.value = savedTask.duration || 60;
   selectedImageBase64 = savedTask.image || "";
}

imageInput.addEventListener("change", function (event) {
   const file = event.target.files[0];

   if (!file) {
      selectedImageBase64 = "";
      return;
   }

   const reader = new FileReader();

   reader.onload = function () {
      selectedImageBase64 = reader.result;
   };

   reader.readAsDataURL(file);
});

taskForm.addEventListener("submit", function (event) {
   event.preventDefault();

   const task = {
      title: titleInput.value.trim(),
      instruction: instructionInput.value.trim(),
      question: questionInput.value.trim(),
      image: selectedImageBase64,
      duration: Number(durationInput.value),
   };

   saveToStorage(STORAGE_KEYS.writingTask, task);
   showMessage("Task saqlandi!");
   renderPreview();
});

clearTaskBtn.addEventListener("click", function () {
   removeFromStorage(STORAGE_KEYS.writingTask);

   taskForm.reset();
   durationInput.value = 60;
   selectedImageBase64 = "";
   previewContent.innerHTML = `<p>Task hali saqlanmadi.</p>`;

   showMessage("Saved task cleared.", "danger");
});

loadTaskIntoForm();
renderPreview();