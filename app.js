document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
});

function initializeApp() {
    loadMoodLogs();
    setupEventListeners();
    setupCalendar();
}

function setupEventListeners() {
    document.querySelectorAll(".mood-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const mood = button.dataset.mood;
            saveOrUpdateMood(mood);
            loadMoodLogs();
        });
    });
}

function saveOrUpdateMood(mood) {
    let moods = JSON.parse(localStorage.getItem("moods")) || [];
    let date = document.getElementById("mood-date").value || new Date().toISOString().split("T")[0];

    const existingEntryIndex = moods.findIndex(entry => entry.date === date);

    if (existingEntryIndex !== -1) {
        moods[existingEntryIndex].mood = mood;
    } else {
        moods.push({ mood, date });
    }

    localStorage.setItem("moods", JSON.stringify(moods));
    loadMoodLogs(date);
}

function loadMoodLogs(selectedDate = "") {
    const logContainer = document.querySelector("#mood-history");
    logContainer.innerHTML = "";
    let moods = JSON.parse(localStorage.getItem("moods")) || [];

    let filteredMoods = moods.filter(entry => !selectedDate || entry.date === selectedDate);

    if (filteredMoods.length === 0) {
        loadMoodLogs();
        return;
    }

    filteredMoods.reverse().forEach((entry) => {
        const div = document.createElement("div");
        div.textContent = `${entry.date}: ${getMoodEmoji(entry.mood)} ${entry.mood}`;
        logContainer.appendChild(div);
    });
}

function getMoodEmoji(mood) {
    const moodEmojis = {
        "Happy": "😊",
        "Sad": "😢",
        "Angry": "😡",
        "Excited": "🤩",
        "Relaxed": "😌",
        "Anxious": "😰"
    };
    return moodEmojis[mood] || "😶";
}