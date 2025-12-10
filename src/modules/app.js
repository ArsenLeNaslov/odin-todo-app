import { Project } from './project.js';
import { Todo } from './todo.js';
import { Storage } from './storage.js';

export class App {
    constructor() {
        const loadedData = Storage.load();
        
        if (loadedData) {
            this.projects = loadedData.projects;
            this.currentProject = this.projects.find(proj => proj.id === loadedData.currentProjectId) || this.projects[0];
            this.defaultProject = this.projects[0];
        } else {
            this.projects = [];
            this.defaultProject = new Project('Default Project');
            this.projects.push(this.defaultProject);
            this.currentProject = this.defaultProject;
        }
    }

    save() {
        if (this.projects && this.currentProject) {
            Storage.save(this);
        }
    }
     addProject(name) {
        const newProject = new Project(name);
        this.projects.push(newProject);
        this.save();
        return newProject;
    }

    //Creates a new array with elements that pass the test
    deleteProject(projectId) {
        this.projects = this.projects.filter(project => project.id !== projectId);
        if (this.currentProject.id === projectId) {
            this.currentProject = this.defaultProject;
        }
        this.save();
    }

    setCurrentProject(projectId) {
        const project = this.projects.find(proj => proj.id === projectId);
        if (project) {
            this.currentProject = project;
            this.save();
        }
    }

    getProject(projectId) {
        return this.projects.find(project => project.id === projectId);
    }

    addTodoToCurrent(todoData) {
        // Makes sure currentProject exists
        if (!this.currentProject) {
            console.error('There are no current Projects available');
            return null;
        }
        
        const todo = new Todo(
            todoData.title,
            todoData.description,
            todoData.dueDate,
            todoData.priority,
            todoData.notes
        );
        this.currentProject.addTodo(todo);
        this.save();
        return todo;
    }
} 