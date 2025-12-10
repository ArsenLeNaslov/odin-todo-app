export const DOM = {
    renderProjects(app) {
        const projectsList = document.getElementById('projects-list');
        if (!projectsList) return;
        
        projectsList.innerHTML = '';
        
        app.projects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project-item';
            projectElement.innerHTML = `
                <span>${project.name}</span>
                ${project.id !== app.defaultProject.id ? 
                    `<button class="delete-project" data-id="${project.id}">×</button>` : 
                    ''
                }
            `;
            
            // Clicks to switch project
            projectElement.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-project')) {
                    app.setCurrentProject(project.id);
                    this.renderTodos(app);
                }
            });
            
            projectsList.appendChild(projectElement);
        });
    },

  renderTodos(app) {
    const todosList = document.getElementById('todos-list');
    const currentProject = document.getElementById('current-project');
    
    if (!todosList || !currentProject) return;
    
    todosList.innerHTML = '';
            currentProject.textContent = app.currentProject.name;

    app.currentProject.todos.forEach(todo => {
    
        const isOverdue = todo.isOverdue();
        const todoElement = document.createElement('div');
        todoElement.className = `todo-item ${todo.priority} ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`;
        
        const dueDateElement = todo.getFormattedDueDate();
        const isOverdueText = isOverdue ? 'overdue' : '';
        
        todoElement.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-title">${todo.title}</span>
            <span class="todo-due ${isOverdueText}">${dueDateElement}</span>
            <button class="delete-todo" data-id="${todo.id}">×</button>
        `;
        
        // Adds event listener for checkbox 
        const checkbox = todoElement.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            todo.toggleComplete();
            app.save();
            this.renderTodos(app);
        });
        
        // Makes Todo clickable for editing
        todoElement.addEventListener('click', (e) => {
            if (!e.target.matches('input[type="checkbox"]') && !e.target.classList.contains('delete-todo')) {
                this.showTodoModal(app, todo);
            }
        });
        
        todosList.appendChild(todoElement);
    });
},

    setupEventListeners(app) {
        // New Project button
        const newProjectBtn = document.getElementById('new-project-btn');
        if (newProjectBtn) {
            newProjectBtn.addEventListener('click', () => {
                const name = prompt('Enter Project Name:');
                if (name) {
                    app.addProject(name);
                    this.renderProjects(app);
                }
            });
        }
        
        // New Todo button
        const newTodoBtn = document.getElementById('new-todo-btn');
        if (newTodoBtn) {
            newTodoBtn.addEventListener('click', () => {
                this.showTodoModal(app);
            });
        } 

        // Add event delegation for delete buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-project')) {
                const projectId = e.target.dataset.id;
                if (confirm('Are you sure you want to delete this Project?')) {
                    app.deleteProject(projectId);
                    this.renderProjects(app);
                    this.renderTodos(app);
                }
            }
            
            if (e.target.classList.contains('delete-todo')) {
                const todoId = e.target.dataset.id;
                if (confirm('Are you sure you want to delete this To Do?')) {
                    app.currentProject.removeTodo(todoId);
                    app.save();
                    this.renderTodos(app);
                }
            }
        });
    },

    showTodoModal(app, todo = null) {
        // Creates modal HTML
        const modalHTML = `
            <div id="todo-modal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h3>${todo ? 'Edit To Do' : 'New To Do'}</h3>
                    <form id="todo-form">
                        <input type="text" id="todo-title" placeholder="Title" value="${todo ? todo.title : ''}" required>
                        <textarea id="todo-description" placeholder="Description">${todo ? todo.description : ''}</textarea>
                        <input type="date" id="todo-dueDate" value="${todo ? todo.dueDate : ''}" required>
                        <select id="todo-priority">
                            <option value="low" ${todo && todo.priority === 'low' ? 'selected' : ''}>Low</option>
                            <option value="medium" ${todo && todo.priority === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="high" ${todo && todo.priority === 'high' ? 'selected' : ''}>High</option>
                        </select>
                        <textarea id="todo-notes" placeholder="Notes">${todo ? todo.notes : ''}</textarea>
                        <button type="submit">${todo ? 'Update To Do' : 'Save To Do'}</button>
                    </form>
                </div>
            </div>
        `;
        
        // Removes existing modal if any
        const existingModal = document.getElementById('todo-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Adds Modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Gets Modal elements
        const modal = document.getElementById('todo-modal');
        const closeBtn = modal.querySelector('.close');
        const form = document.getElementById('todo-form');
        
        // Shows Modal      
        modal.style.display = 'block';
        // Closes Modal when X is clicked
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        // Closes Modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Handles form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const todoData = {
                title: document.getElementById('todo-title').value,
                description: document.getElementById('todo-description').value,
                dueDate: document.getElementById('todo-dueDate').value,
                priority: document.getElementById('todo-priority').value,
                notes: document.getElementById('todo-notes').value
            };
            
            if (todo) {
                // Updates existing To Do
                todo.title = todoData.title;
                todo.description = todoData.description;
                todo.dueDate = todoData.dueDate;
                todo.priority = todoData.priority;
                todo.notes = todoData.notes;
            } else {
                // Creates new To Do
                app.addTodoToCurrent(todoData);
            }
            
            app.save();
            this.renderTodos(app);
            modal.remove();
        });
    }
};