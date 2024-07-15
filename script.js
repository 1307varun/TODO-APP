document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('.filters button');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskInput.value);
        taskInput.value = '';
        saveTasks();
        renderTasks();
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderTasks(button.id);
        });
    });

    function addTask(task) {
        tasks.push({ text: task, completed: false });
    }

    function editTask(index, newText) {
        tasks[index].text = newText;
        saveTasks();
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function toggleTaskCompletion(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter === 'active') return !task.completed;
            if (filter === 'completed') return task.completed;
            return true;
        });

        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.classList.toggle('completed', task.completed);

            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            taskItem.appendChild(taskText);

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit');
            editButton.addEventListener('click', () => {
                const newText = prompt('Edit task:', task.text);
                if (newText) {
                    editTask(index, newText);
                }
            });
            taskItem.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete');
            deleteButton.addEventListener('click', () => deleteTask(index));
            taskItem.appendChild(deleteButton);

            const toggleButton = document.createElement('button');
            toggleButton.textContent = task.completed ? 'Unmark' : 'Complete';
            toggleButton.addEventListener('click', () => toggleTaskCompletion(index));
            taskItem.appendChild(toggleButton);

            taskList.appendChild(taskItem);
        });
    }

    renderTasks();
});