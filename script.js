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
  let events = JSON.parse(localStorage.getItem("events")) || {};
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  
  // Функция для отображения текущей даты
  function displayCurrentDate() {
	const dateElement = document.getElementById("currentDate");
	const options = { weekday: 'long', day: 'numeric', month: 'long' };
	const today = new Date();
	dateElement.textContent = today.toLocaleDateString('ru-RU', options);
  }
  
  //Dynamic Island"
  function showDynamicIsland(message) {
	const dynamicIsland = document.getElementById("dynamicIsland");
	const islandMessage = document.getElementById("islandMessage");
  
	islandMessage.textContent = message;
	dynamicIsland.classList.remove("hidden");
	dynamicIsland.classList.add("visible");
  
	// Автоматическое скрытие уведомления через 3 секунды
	setTimeout(() => {
	  dynamicIsland.classList.add("fade-out");
	  setTimeout(() => {
		dynamicIsland.classList.remove("visible", "fade-out");
		dynamicIsland.classList.add("hidden");
	  }, 500);
	}, 3000);
  }
  
  //добавление задачи с сохранением в localStorage
  function addTask() {
	const taskInput = document.getElementById("taskInput");
	const taskList = document.getElementById("taskList");
  
	if (taskInput.value) {
	  const task = taskInput.value;
	  tasks.push(task);
	  localStorage.setItem("tasks", JSON.stringify(tasks));
  
	  const li = document.createElement("li");
	  li.className = "task-item";
	  li.textContent = task;
  
	  const deleteBtn = document.createElement("span");
	  deleteBtn.textContent = "✖";
	  deleteBtn.className = "delete-btn";
	  deleteBtn.onclick = () => removeTask(li, task);
  
	  li.appendChild(deleteBtn);
	  taskList.appendChild(li);
	  taskInput.value = "";
  
	  showDynamicIsland("Задача добавлена");
	}
  }
  
  // Удаление задачи с обновлением localStorage
  function removeTask(item, task) {
	item.classList.add("fade-out");
	setTimeout(() => {
	  tasks = tasks.filter(t => t !== task);
	  localStorage.setItem("tasks", JSON.stringify(tasks));
	  item.remove();
	}, 500);
  }
  
  // Функция добавления заметки с сохранением в localStorage
  function addNote() {
	const noteInput = document.getElementById("noteInput");
	const noteList = document.getElementById("noteList");
  
	if (noteInput.value) {
	  const note = noteInput.value;
	  notes.push(note);
	  localStorage.setItem("notes", JSON.stringify(notes));
  
	  const div = document.createElement("div");
	  div.className = "note-item";
	  div.textContent = note;
  
	  const deleteBtn = document.createElement("span");
	  deleteBtn.textContent = "✖";
	  deleteBtn.className = "delete-btn";
	  deleteBtn.onclick = () => removeNote(div, note);
  
	  div.appendChild(deleteBtn);
	  noteList.appendChild(div);
	  noteInput.value = "";
  
	  showDynamicIsland("Заметка сохранена");
	}
  }
  
  // Удаление заметки с обновлением localStorage
  function removeNote(item, note) {
	item.classList.add("fade-out");
	setTimeout(() => {
	  notes = notes.filter(n => n !== note);
	  localStorage.setItem("notes", JSON.stringify(notes));
	  item.remove();
	}, 500);
  }
  
  //календарь
  document.addEventListener("DOMContentLoaded", () => {
	displayCurrentDate();
	loadTasks();
	loadNotes();
	loadEvents();
  
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
	  
	  dayDiv.addEventListener("click", () => highlightSelectedDay(dayDiv));
	  dayDiv.addEventListener("mouseenter", showEventTooltip);
	  dayDiv.addEventListener("mouseleave", hideEventTooltip);
  
	  if (events[dayDiv.dataset.date]) {
		dayDiv.dataset.event = events[dayDiv.dataset.date];
	  }
  
	  calendar.appendChild(dayDiv);
	}
  
	updateProgressBar();
	setInterval(updateProgressBar, 1000); // Обновляем каждую секунду
  });
  
  // Загрузка задач из localStorage
  function loadTasks() {
	tasks.forEach(task => {
	  const taskList = document.getElementById("taskList");
	  const li = document.createElement("li");
	  li.className = "task-item";
	  li.textContent = task;
  
	  const deleteBtn = document.createElement("span");
	  deleteBtn.textContent = "✖";
	  deleteBtn.className = "delete-btn";
	  deleteBtn.onclick = () => removeTask(li, task);
  
	  li.appendChild(deleteBtn);
	  taskList.appendChild(li);
	});
  }
  
  // Загрузка заметок из localStorage
  function loadNotes() {
	notes.forEach(note => {
	  const noteList = document.getElementById("noteList");
	  const div = document.createElement("div");
	  div.className = "note-item";
	  div.textContent = note;
  
	  const deleteBtn = document.createElement("span");
	  deleteBtn.textContent = "✖";
	  deleteBtn.className = "delete-btn";
	  deleteBtn.onclick = () => removeNote(div, note);
  
	  div.appendChild(deleteBtn);
	  noteList.appendChild(div);
	});
  }
  
  // сохранение события в localStorage
  function highlightSelectedDay(dayDiv) {
	document.querySelectorAll(".calendar-day").forEach((day) => day.classList.remove("highlighted"));
	dayDiv.classList.add("highlighted");
  
	const eventTitle = prompt("Введите название события:");
	if (eventTitle) {
	  events[dayDiv.dataset.date] = eventTitle;
	  dayDiv.dataset.event = eventTitle;
	  localStorage.setItem("events", JSON.stringify(events));
	  showDynamicIsland("Событие добавлено на " + dayDiv.textContent);
	}
  }
  
  // Загрузка событий из localStorage
  function loadEvents() {
	Object.keys(events).forEach(date => {
	  const dayDiv = document.querySelector(`[data-date="${date}"]`);
	  if (dayDiv) {
		dayDiv.dataset.event = events[date];
	  }
	});
  }
  
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
  

  function hideEventTooltip(event) {
	const tooltip = event.target.querySelector(".event-tooltip");
	if (tooltip) {
	  tooltip.remove();
	}
  }
  
  // Обновление прогресс-бара до ближайшего события
  function updateProgressBar() {
	const currentTime = new Date();
	const eventDates = Object.keys(events).map(date => new Date(date));
  
	const upcomingEvents = eventDates.filter(eventDate => eventDate > currentTime);
	if (upcomingEvents.length === 0) {
	  document.getElementById("next-event").textContent = "Событие: Нет запланированных событий";
	  document.getElementById("time-remaining").textContent = "00:00:00";
	  document.getElementById("progress").style.strokeDashoffset = 314;
	  return;
	}
  
	const nextEvent = new Date(Math.min(...upcomingEvents));
	const timeDifference = nextEvent - currentTime;
	const eventTitle = events[nextEvent.toISOString().split("T")[0]];
	document.getElementById("next-event").textContent = `Событие: ${eventTitle}`;
  
	// оставшееся время в часах, минутах и секундах
	const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
	const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
	const seconds = Math.floor((timeDifference / 1000) % 60);
	document.getElementById("time-remaining").textContent = 
	  `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
	// прогресс-бар
	const totalMinutes = 24 * 60;
	const minutesUntilEvent = (nextEvent - new Date(currentTime.setHours(0, 0, 0, 0))) / (1000 * 60);
	const progressPercent = minutesUntilEvent / totalMinutes;
	document.getElementById("progress").style.strokeDashoffset = 314 - (314 * progressPercent);
  }
  