import { levels } from './levels.js';

let currentLevel = 0;
let completedLevels = new Set()
let ws = null;

function loadLevel(levelIndex) {
    currentLevel = levelIndex;
    const level = levels[levelIndex];
    
    document.getElementById("level-num").textContent = levelIndex + 1;
    document.getElementById("theory").innerHTML = level.theory;
    document.getElementById("task-text").textContent = level.task;
    document.getElementById("code-editor").value = level.code;
    document.getElementById("hint-area").innerHTML = level.hint;
    document.getElementById("hint-area").style.display = "none";
    document.getElementById("output").innerHTML = "";
    document.getElementById("frog").classList.remove("jump");
    document.getElementById("next-btn").disabled = true;
    updateLevelProgress();
}

function connectWebSocket() {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws`;
    
    ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
        console.log("WebSocket connected");
    };
    
    ws.onmessage = (event) => {
        const output = document.getElementById("output");
        const msg = document.createElement("div");
        
        if (event.data.startsWith("✅")) {
            completedLevels.add(currentLevel);
            updateLevelProgress();
            msg.className = "success";
            document.getElementById("frog").classList.add("jump");
            document.getElementById("next-btn").disabled = false;
        } else if (event.data.startsWith("❌")) {
            msg.className = "error";
        } else {
            msg.className = "output-message";
        }
        
        msg.textContent = event.data;
        output.appendChild(msg);
        output.scrollTop = output.scrollHeight;
    };
    
    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        document.getElementById("output").innerHTML = 
            `<div class="error">Ошибка соединения. Проверьте:<br>
             1. Запущен ли сервер?<br>
             2. Не блокирует ли соединение брандмауэр?</div>`;
    };
}

function updateLevelProgress() {
    const progressContainer = document.getElementById("level-progress");
    progressContainer.innerHTML = '';
    
    levels.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.className = `level-dot ${completedLevels.has(index) ? 'completed' : ''}`;
        dot.textContent = index + 1;
        dot.addEventListener('click', () => {
            if (currentLevel !== index) {
                currentLevel = index;
                loadLevel(currentLevel);
            }
        });
        
        // Подсветка текущего уровня
        if (currentLevel === index) {
            dot.style.boxShadow = '0 0 0 2px #3498db';
        }
        
        progressContainer.appendChild(dot);
    });
}

document.getElementById("run-btn").addEventListener("click", () => {
    const code = document.getElementById("code-editor").value;
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(code);
    } else {
        document.getElementById("output").innerHTML = 
            `<div class="error">Соединение не установлено. Попробуйте обновить страницу.</div>`;
    }
});

document.getElementById("hint-btn").addEventListener("click", function() {
    const hintArea = document.getElementById("hint-area");
    if (hintArea.style.display === "none") {
        hintArea.style.display = "block";
        this.textContent = "Скрыть подсказку";
    } else {
        hintArea.style.display = "none";
        this.textContent = "Показать подсказку";
    }
});

document.getElementById("next-btn").addEventListener("click", () => {
    if (currentLevel < levels.length - 1) {
        currentLevel++;
        loadLevel(currentLevel);
    } else {
        document.getElementById("output").innerHTML = 
            `<div class="success">🎉 Поздравляем! Вы прошли все уровни!</div>`;
    }
});

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    loadLevel(0);
    connectWebSocket();
    updateLevelProgress();
});