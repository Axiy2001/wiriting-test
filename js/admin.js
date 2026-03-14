const taskForm = document.getElementById("taskForm");

const part1TitleInput = document.getElementById("part1Title");
const part1InstructionInput = document.getElementById("part1Instruction");
const part1QuestionInput = document.getElementById("part1Question");
const part1ImageInput = document.getElementById("part1Image");

const part2TitleInput = document.getElementById("part2Title");
const part2InstructionInput = document.getElementById("part2Instruction");
const part2QuestionInput = document.getElementById("part2Question");
const part2ImageInput = document.getElementById("part2Image");

const durationInput = document.getElementById("duration");
const clearTaskBtn = document.getElementById("clearTaskBtn");
const messageBox = document.getElementById("message");
const previewContent = document.getElementById("previewContent");

let selectedPart1ImageBase64 = "";
let selectedPart2ImageBase64 = "";

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
      <h3>Part 1</h3>
      <p><strong>Title:</strong> ${savedTask.part1.title}</p>
      <p><strong>Instruction:</strong> ${savedTask.part1.instruction}</p>
      <p><strong>Question:</strong> ${savedTask.part1.question}</p>
      ${savedTask.part1.image
         ? `<img src="${savedTask.part1.image}" alt="Part 1 Image" class="preview-image" />`
         : `<p><strong>Image:</strong> Rasm yuklanmadi</p>`
      }

      <hr style="margin:20px 0;">

      <h3>Part 2</h3>
      <p><strong>Title:</strong> ${savedTask.part2.title}</p>
      <p><strong>Instruction:</strong> ${savedTask.part2.instruction}</p>
      <p><strong>Question:</strong> ${savedTask.part2.question}</p>
      ${savedTask.part2.image
         ? `<img src="${savedTask.part2.image}" alt="Part 2 Image" class="preview-image" />`
         : `<p><strong>Image:</strong> Rasm yuklanmadi</p>`
      }

      <hr style="margin:20px 0;">

      <p><strong>Total Duration:</strong> ${savedTask.duration} minutes</p>
   `;
}

function loadTaskIntoForm() {
   const savedTask = getFromStorage(STORAGE_KEYS.writingTask);

   if (!savedTask) return;

   part1TitleInput.value = savedTask.part1?.title || "";
   part1InstructionInput.value = savedTask.part1?.instruction || "";
   part1QuestionInput.value = savedTask.part1?.question || "";
   selectedPart1ImageBase64 = savedTask.part1?.image || "";

   part2TitleInput.value = savedTask.part2?.title || "";
   part2InstructionInput.value = savedTask.part2?.instruction || "";
   part2QuestionInput.value = savedTask.part2?.question || "";
   selectedPart2ImageBase64 = savedTask.part2?.image || "";

   durationInput.value = savedTask.duration || 60;
}

function handleImageChange(inputElement, callback) {
   inputElement.addEventListener("change", function (event) {
      const file = event.target.files[0];

      if (!file) {
         callback("");
         return;
      }

      const reader = new FileReader();

      reader.onload = function () {
         callback(reader.result);
      };

      reader.readAsDataURL(file);
   });
}

handleImageChange(part1ImageInput, function (result) {
   selectedPart1ImageBase64 = result;
});

handleImageChange(part2ImageInput, function (result) {
   selectedPart2ImageBase64 = result;
});

taskForm.addEventListener("submit", function (event) {
   event.preventDefault();

   const task = {
      duration: Number(durationInput.value),
      part1: {
         title: part1TitleInput.value.trim(),
         instruction: part1InstructionInput.value.trim(),
         question: part1QuestionInput.value.trim(),
         image: selectedPart1ImageBase64,
         minWords: 150
      },
      part2: {
         title: part2TitleInput.value.trim(),
         instruction: part2InstructionInput.value.trim(),
         question: part2QuestionInput.value.trim(),
         image: selectedPart2ImageBase64,
         minWords: 250
      }
   };

   saveToStorage(STORAGE_KEYS.writingTask, task);
   showMessage("Task saqlandi!");
   renderPreview();
});

clearTaskBtn.addEventListener("click", function () {
   removeFromStorage(STORAGE_KEYS.writingTask);
   removeFromStorage(STORAGE_KEYS.writingDraft);
   removeFromStorage(STORAGE_KEYS.lastSubmission);

   taskForm.reset();
   durationInput.value = 60;

   selectedPart1ImageBase64 = "";
   selectedPart2ImageBase64 = "";

   previewContent.innerHTML = `<p>Task hali saqlanmadi.</p>`;

   showMessage("Saved task cleared.", "danger");
});

loadTaskIntoForm();
renderPreview();