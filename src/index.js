import { App } from './modules/app.js';
import { DOM } from './modules/dom.js';
import './styles/style.css';

// Initialises the Application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing app...');
    
    const app = new App();
    const dom = DOM;

    console.log('App created:', app);
    console.log('Projects:', app.projects);
    console.log('Current project:', app.currentProject);

    // Adds sample data if no To Dos exist AND Current Project exists
    if (app.currentProject && app.currentProject.todos.length === 0) {
        console.log('Adding sample To Dos...');
        
        // Adds sample To Dos one by one with error handling
        try {
            const todo1 = app.addTodoToCurrent({
                title: 'Welcome to Odin To Do App!',
                description: 'This is your first To Do',
                dueDate: new Date().toISOString().split('T')[0],
                priority: 'high',
                notes: 'You can edit me by clicking on this To Do!'
            });
            console.log('First To Do added:', todo1);
            
            const todo2 = app.addTodoToCurrent({
                title: 'Create a New Project',
                description: 'Try creating different Projects!',
                dueDate: new Date().toISOString().split('T')[0],
                priority: 'low',
                notes: ''
            });
            console.log('Second To Do added:', todo2);
        } catch (error) {
            console.error('Error adding sample To Dos:', error);
        }
    }

    // Sets up Event Listeners
    console.log('Setting up event listeners');
    dom.setupEventListeners(app);

    // Initial render
    console.log('Rendering initial view');
    dom.renderProjects(app);
    dom.renderTodos(app);

    // Makes App available globally for debugging
    window.app = app;
    window.dom = dom;
    
    console.log('🪐 Odin To Do App initialised successfully!');
});