// Регистрация сервис-воркера для PWA
if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
	  navigator.serviceWorker
		.register("/service-worker.js")
		.then((registration) => {
		  console.log("Сервис-воркер зарегистрирован:", registration);
		})
		.catch((error) => {
		  console.log("Ошибка регистрации сервис-воркера:", error);
		});
	});
  }
  
  // Код органайзера, функции для задач, заметок и календаря
  let events = {};
  
  // Функция для отображения текущей даты
  function displayCurrentDate() {
	const dateElement = document.getElementById("currentDate");
	const options = { weekday: 'long', day: 'numeric', month: 'long' };
	const today = new Date();
	dateElement.textContent = today.toLocaleDateString('ru-RU', options);
  }
  
  // Показ уведомления в стиле "Dynamic Island"
  function showDynamicIsland(message) {
	const dynamicIsland = document.getElementById("dynamicIsland");
	const islandMessage = document.getElementById("islandMessage");
	
	islandMessage.textContent = message;
	dynamicIsland.classList.remove("hidden");
	dynamicIsland.classList.add("visible");
  
	// Автоматическое скрытие уведомления через 3 секунды
	setTimeout(() => {
	  dynamicIsland.classList.remove("visible");
	  dynamicIsland.classList.add("hidden");
	}, 3000);
  }
  
  // Функция добавления задачи с уведомлением
  function addTask() {
	const taskInput = document.getElementById("taskInput");
	const taskList = document.getElementById("taskList");
  
	if (taskInput.value) {
	  const li = document.createElement("li");
	  li.className = "task-item";
	  li.textContent = taskInput.value;
  
	  const deleteBtn = document.createElement("span");
	  deleteBtn.textContent = "✖";
	  deleteBtn.className = "delete-btn";
	  deleteBtn.onclick = () => li.remove();
	  li.appendChild(deleteBtn);
  
	  taskList.appendChild(li);
	  taskInput.value = "";
  
	  // Показываем уведомление
	  showDynamicIsland("Задача добавлена");
	}
  }
  
  // Функция добавления заметки с уведомлением
  function addNote() {
	const noteInput = document.getElementById("noteInput");
	const noteList = document.getElementById("noteList");
  
	if (noteInput.value) {
	  const div = document.createElement("div");
	  div.className = "note-item";
	  div.textContent = noteInput.value;
  
	  const deleteBtn = document.createElement("span");
	  deleteBtn.textContent = "✖";
	  deleteBtn.className = "delete-btn";
	  deleteBtn.onclick = () => div.remove();
	  div.appendChild(deleteBtn);
  
	  noteList.appendChild(div);
	  noteInput.value = "";
  
	  // Показываем уведомление
	  showDynamicIsland("Заметка сохранена");
	}
  }
  
  document.addEventListener("DOMContentLoaded", () => {
	displayCurrentDate();
  
	const calendar = document.getElementById("calendar");
	const date = new Date();
	const month = date.toLocaleString("ru-RU", { month: "long" });
	const year = date.getFullYear();
	const daysInMonth = new Date(year, date.getMonth() + 1, 0).getDate();
  
	calendar.innerHTML = `<h3>${month.charAt(0).toUpperCase() + month.slice(1)} ${year}</h3>`;
	
	for (let day = 1; day <= daysInMonth; day++) {
	  const dayDiv = document.createElement("div");
	  dayDiv.className = "calendar-day";
	  dayDiv.textContent = day;
	  dayDiv.dataset.date = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
	  
	  dayDiv.addEventListener("mouseenter", showEventTooltip);
	  dayDiv.addEventListener("mouseleave", hideEventTooltip);
  
	  calendar.appendChild(dayDiv);
	}
  });
  
  // Показ всплывающей подсказки с событием
  function showEventTooltip(event) {
	const dayDiv = event.target;
	const eventText = dayDiv.dataset.event;
  
	if (eventText) {
	  const tooltip = document.createElement("div");
	  tooltip.className = "event-tooltip";
	  tooltip.textContent = eventText;
	  dayDiv.appendChild(tooltip);
	}
  }
  
  // Скрытие всплывающей подсказки
  function hideEventTooltip(event) {
	const tooltip = event.target.querySelector(".event-tooltip");
	if (tooltip) {
	  tooltip.remove();
	}
  }
  