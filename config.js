let tasks = JSON.parse(localStorage.getItem('todoist_tasks')) || [];
let currentPriority = 'low';

const taskInput = document.getElementById('taskInput');

// Event listener para Enter
if (taskInput) {
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
}

function setPriority(priority) {
    currentPriority = priority;

    // Update button styles
    document.querySelectorAll('.priority-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Encontrar o botão clicado se o evento existir, ou usar o index se for chamado via código
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

function saveTasks() {
    localStorage.setItem('todoist_tasks', JSON.stringify(tasks));
}

function addTask() {
    const text = taskInput.value.trim();

    if (!text) return;

    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: currentPriority,
        createdAt: new Date()
    };

    tasks.push(task);
    taskInput.value = '';
    currentPriority = 'low';
    
    // Reset priority buttons
    const priorityButtons = document.querySelectorAll('.priority-btn');
    if (priorityButtons.length >= 3) {
        priorityButtons[0].classList.add('active');
        priorityButtons[1].classList.remove('active');
        priorityButtons[2].classList.remove('active');
    }

    saveTasks();
    renderTasks();
    updateStats();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    if (!tasksList) return;

    if (tasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <p>Nenhuma tarefa ainda!</p>
                <p>Adicione uma tarefa para começar 🚀</p>
            </div>
        `;
        return;
    }

    // Sort tasks by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const sortedTasks = [...tasks].sort((a, b) =>
        priorityOrder[a.priority] - priorityOrder[b.priority]
    );

    tasksList.innerHTML = sortedTasks.map(task => `
        <div class="task-item ${task.priority}-priority ${task.completed ? 'completed' : ''}">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})">
                ${task.completed ? '✓' : ''}
            </div>

            <div class="task-content">
                <div class="task-text ${task.completed ? 'completed' : ''}">
                    ${escapeHtml(task.text)}
                </div>
                <div class="task-date">
                    ${formatDate(task.createdAt)}
                </div>
            </div>

            <div class="priority-badge ${task.priority}">
                ${task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🔵'}
            </div>

            <button class="btn-delete" onclick="deleteTask(${task.id})">
                🗑️
            </button>
        </div>
    `).join('');
}

function updateStats() {
    const total = tasks.length;
    const active = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;

    const totalEl = document.getElementById('totalTasks');
    const activeEl = document.getElementById('activeTasks');
    const completedEl = document.getElementById('completedTasks');

    if (totalEl) totalEl.textContent = total;
    if (activeEl) activeEl.textContent = active;
    if (completedEl) completedEl.textContent = completed;
}

function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('pt-BR', options);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    updateStats();
});
