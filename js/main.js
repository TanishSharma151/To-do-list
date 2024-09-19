const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('task-list');

inputBox.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addTask();
    }
});

let taskCount = 0;

function addTask() {
    const inputText = inputBox.value.trim();

    if (inputText === '') {
        alert('You must write something');
    } else if (inputText.length < 5) {
        alert('You must write at least 5 characters');
    } else {
        taskCount++;

        listContainer.innerHTML += `
            <li id='task-${taskCount}' data-task-id='${taskCount}' class='task-item'>
                <div class='taskSide'>
                    <div class='taskArea'>
                        <input type="checkbox" id='checkbox-${taskCount}'> 
                        &nbsp <span class="task-number">${taskCount}</span>. 
                        &nbsp <span id='taskText-${taskCount}' class='task-text'>${inputText}</span>
                    </div>
                    <div class='taskBtn'>
                        <button onclick="editTask(${taskCount})" id='editBtn-${taskCount}' class='editBtn taskBtn'>&#128393; Edit</button>
                        <button onclick="deleteTask(${taskCount})" id='deleteBtn-${taskCount}' class='deleteBtn taskBtn'>&#x2718; Delete</button>
                    </div>
                    <br>
                </div>
            </li>`;

        inputBox.value = '';

        sortTasks();
    }
}

function deleteTask(taskId) {
    const confirmDelete = confirm('Do you really want to delete the current task?');
    if (confirmDelete) {
        const deleteTask = document.getElementById(`task-${taskId}`);
        deleteTask.remove();
        renumberTasks();
    }
}

function editTask(taskId) {
    const taskTextElement = document.getElementById(`taskText-${taskId}`);
    const currentTaskText = taskTextElement.innerText.trim();
    const editBtn = document.getElementById(`editBtn-${taskId}`);

    editBtn.style.display = 'none';

    taskTextElement.innerHTML = `
        <input type="text" id="editInput-${taskId}" value="${currentTaskText}" class="edit-task">
        <button onclick="saveEdit(${taskId})" class='taskBtn editBtns' id='saveBtn'>Save</button>
        <button onclick="cancelEdit(${taskId}, '${currentTaskText}')" class='taskBtn editBtns' id='cancelBtn'>Cancel</button>
    `;

    document.getElementById(`editInput-${taskId}`).focus();
}

function saveEdit(taskId) {
    const editInput = document.getElementById(`editInput-${taskId}`);
    const newTaskText = editInput.value.trim();
    const editBtn = document.getElementById(`editBtn-${taskId}`);

    editBtn.style.display = 'inline-block';

    if (newTaskText === '') {
        alert('You must write something');
    } else if (newTaskText.length < 5) {
        alert('You must write at least 5 characters');
    } else {
        const taskTextElement = document.getElementById(`taskText-${taskId}`);
        taskTextElement.innerHTML = `${newTaskText}`;
    }
}

function cancelEdit(taskId, originalContent) {
    const taskTextElement = document.getElementById(`taskText-${taskId}`);
    taskTextElement.innerHTML = `&nbsp ${originalContent}`;

    const editBtn = document.getElementById(`editBtn-${taskId}`);
    editBtn.style.display = 'inline-block';
}

function deleteCheckedTasks() {
    const tasks = document.querySelectorAll('.task-item');
    tasks.forEach((task) => {
        const checkbox = task.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            task.remove();
        }
    });
    renumberTasks();
}

function searchTasks() {
    const searchQuery = document.getElementById('search-box').value.toLowerCase().trim();
    const tasks = document.querySelectorAll('.task-item');
    
    if (searchQuery === '') {
        // If search box is empty, show all tasks
        tasks.forEach(task => {
            task.style.display = 'list-item';
        });
    } else {
        // Hide tasks that don't match the search query
        tasks.forEach(task => {
            const taskText = task.querySelector('.task-text').textContent.toLowerCase().trim();
            
            if (taskText.includes(searchQuery)) {
                task.style.display = 'list-item';
            } else {
                task.style.display = 'none';
            }
        });
    }

    document.getElementById('search-box').value = '';
}

function sortTasks() {
    const sortOption = document.getElementById('sort-options').value;
    const tasks = Array.from(document.querySelectorAll('.task-item')); // Convert NodeList to Array
    const listContainer = document.getElementById('task-list');
    
    // Sort tasks based on the selected option using `data-task-id`
    if (sortOption === 'newest') {
        tasks.sort((a, b) => parseInt(b.getAttribute('data-task-id')) - parseInt(a.getAttribute('data-task-id')));
    } else if (sortOption === 'oldest') {
        tasks.sort((a, b) => parseInt(a.getAttribute('data-task-id')) - parseInt(b.getAttribute('data-task-id')));
    }

    // Clear the list container and append the sorted tasks
    listContainer.innerHTML = '';
    tasks.forEach(task => {
        listContainer.appendChild(task);
    });

    // Renumber the tasks after sorting
    renumberTasks();
}

function renumberTasks() {
    const tasks = document.querySelectorAll('.task-item');
    taskCount = tasks.length;

    tasks.forEach((task, index) => {
        const newTaskNumber = index + 1;
        task.id = `task-${newTaskNumber}`;

        const taskNumberElement = task.querySelector('.task-number');
        taskNumberElement.textContent = newTaskNumber;

        const taskTextElement = task.querySelector('.task-text');
        taskTextElement.id = `taskText-${newTaskNumber}`;

        const editBtn = task.querySelector('.editBtn');
        editBtn.setAttribute('onclick', `editTask(${newTaskNumber})`);
        editBtn.id = `editBtn-${newTaskNumber}`;

        const deleteBtn = task.querySelector('.deleteBtn');
        deleteBtn.setAttribute('onclick', `deleteTask(${newTaskNumber})`);
        deleteBtn.id = `deleteBtn-${newTaskNumber}`;
    });
}



