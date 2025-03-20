document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
});

function initializeApp() {
    const today = new Date();
    const formattedDate = formatDateToInput(today);
    document.getElementById("mood-date").value = formattedDate;
    loadMoodLogs("day");
    setupEventListeners();
    updateCalendarView();
}

function setupEventListeners() {
    document.querySelectorAll(".mood-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const mood = button.dataset.mood;
            saveOrUpdateMood(mood);
        });
    });

    document.getElementById("mood-filter").addEventListener("change", () => {
        loadMoodLogs(getSelectedFilter());
    });

    document.getElementById("mood-date").addEventListener("change", () => {
        loadMoodLogs(getSelectedFilter());
        updateCalendarView();
    });
}

function saveOrUpdateMood(mood) {
    let moods = JSON.parse(localStorage.getItem("moods")) || [];
    let inputDate = document.getElementById("mood-date").value;
    let formattedDate = formatDateToDisplay(inputDate);

    const existingEntryIndex = moods.findIndex(entry => entry.date === formattedDate);

    if (existingEntryIndex !== -1) {
        moods[existingEntryIndex].mood = mood;
    } else {
        moods.push({ mood, date: formattedDate });
    }

    localStorage.setItem("moods", JSON.stringify(moods));
    loadMoodLogs(getSelectedFilter());
    updateCalendarView();
}

function loadMoodLogs(filterType) {
    const logContainer = document.querySelector("#mood-history");
    logContainer.innerHTML = "";

    let moods = JSON.parse(localStorage.getItem("moods")) || [];
    let today = new Date();
    let filteredMoods = [];

    if (filterType === "day") {
        let inputDate = document.getElementById("mood-date").value;
        let formattedDate = formatDateToDisplay(inputDate);
        filteredMoods = moods.filter(mood => mood.date === formattedDate);
    } else if (filterType === "week") {
        let lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);
        filteredMoods = moods.filter(entry => parseDate(entry.date) >= lastWeek);
    } else if (filterType === "month") {
        let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        filteredMoods = moods.filter(entry => parseDate(entry.date) >= firstDayOfMonth);
    } else {
        filteredMoods = moods;
    }

    filteredMoods.reverse().forEach((entry) => {
        const div = document.createElement("div");
        div.classList.add("mood-entry");
        div.textContent = `${entry.date}: ${getMoodEmoji(entry.mood)} ${entry.mood}`;
        div.setAttribute("aria-label", `Mood recorded on ${entry.date}: ${entry.mood}`);
        logContainer.appendChild(div);
    });

    logContainer.scrollTop = logContainer.scrollHeight; // Auto-scroll to newest mood
}

function updateCalendarView() {
    let moods = JSON.parse(localStorage.getItem("moods")) || [];
    let selectedDate = document.getElementById("mood-date").value;
    let [year, month] = selectedDate.split("-");
    month = parseInt(month, 10);

    let calendarGrid = document.querySelector(".calendar-grid");
    calendarGrid.innerHTML = "";

    let daysInMonth = new Date(year, month, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        let dayBox = document.createElement("div");
        dayBox.classList.add("calendar-day");
        dayBox.textContent = i;
        dayBox.setAttribute("aria-label", `Day ${i}`);

        let moodEntry = moods.find(entry => {
            let entryDate = parseDate(entry.date);
            return entryDate.getFullYear() == year && entryDate.getMonth() + 1 == month && entryDate.getDate() == i;
        });

        if (moodEntry) {
            dayBox.textContent += ` ${getMoodEmoji(moodEntry.mood)}`;
            dayBox.classList.add("mood-logged"); // Add a visual highlight
        }

        calendarGrid.appendChild(dayBox);
    }
}

function getSelectedFilter() {
    return document.getElementById("mood-filter").value;
}

function getMoodEmoji(mood) {
    return {
        "Happy": "😊", "Sad": "😢", "Angry": "😡",
        "Excited": "🤩", "Relaxed": "😌", "Anxious": "😰"
    }[mood] || "😶";
}

// Utility functions for date conversion
function formatDateToInput(date) {
    return date.toISOString().split("T")[0];
}

function formatDateToDisplay(inputDate) {
    let [year, month, day] = inputDate.split("-");
    return `${day}/${month}/${year}`;
}

function parseDate(dateStr) {
    let [day, month, year] = dateStr.split("/");
    return new Date(year, month - 1, day);
}