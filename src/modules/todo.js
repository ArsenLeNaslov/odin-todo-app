import { format, isBefore, isToday, isTomorrow } from 'date-fns';

export class Todo {
    constructor(title, description, dueDate, priority, notes = '') {
        this.id = Date.now().toString();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.completed = false;
        this.createdAt = new Date();
    }

    toggleComplete() {
        this.completed = !this.completed;
    }

    setPriority(newPriority) {
        this.priority = newPriority;
    }

    updateDueDate(newDueDate) {
        this.dueDate = newDueDate;
    }

    getFormattedDueDate() {
        try {
            const date = new Date(this.dueDate);
            if (isToday(date)) {
                return 'Today';
            } else if (isTomorrow(date)) {
                return 'Tomorrow';
            } else if (isBefore(date, new Date()) && !this.completed) {
                return format(date, 'MMM dd, yyyy') + ' (Overdue)';
            } else {
                return format(date, 'MMM dd, yyyy');
            }
        } catch (error) {
            return this.dueDate;
        }
    }

    isOverdue() {
        try {
            return isBefore(new Date(this.dueDate), new Date()) && !this.completed;
        } catch (error) {
            return false;
        }
    }
}