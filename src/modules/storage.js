
import { Project } from './project.js';
import { Todo } from './todo.js';

export const Storage = {
    save(app) {
        const data = {
            //Maps transform every element
            projects: app.projects.map(project => ({
                id: project.id,
                name: project.name,
                todos: project.todos.map(todo => ({
                    id: todo.id,
                    title: todo.title,
                    description: todo.description,
                    dueDate: todo.dueDate,
                    priority: todo.priority,
                    notes: todo.notes,
                    completed: todo.completed,
                    createdAt: todo.createdAt
                }))
            })),
            currentProjectId: app.currentProject.id
        };
        
        localStorage.setItem('todoApp', JSON.stringify(data));
    },

    load() {
        const rawdata = JSON.parse(localStorage.getItem('todoApp'));
        if (!rawdata) return null;
        const projects = rawdata.projects.map(projData => {
            const project = new Project(projData.name);
            project.id = projData.id;
            project.todos = projData.todos.map(todoData => {
                    const todo = new Todo(
                        todoData.title,
                        todoData.description,
                        todoData.dueDate,
                        todoData.priority,
                        todoData.notes
                    );
                    todo.id = todoData.id;
                    todo.completed = todoData.completed;
                    todo.createdAt = new Date(todoData.createdAt);
                    return todo;
            });
            return project;
        });

        return { projects, currentProjectId: rawdata.currentProjectId };
    }
};