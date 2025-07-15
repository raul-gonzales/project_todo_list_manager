import { Task } from "../modules/task";

class TaskService {
  constructor() {
    this.tasks = this._loadTasks(); // Load tasks from localStorage once
  }

  /* CREATE */
  createTask(title, description, dueDate, priority, notes = "", status = false) {
    if (!title) throw new Error("Title is required.");

    const newTask = new Task(title, description, dueDate, priority, notes, status);
    this.tasks.push(newTask);
    this._saveTasks();
    return newTask;
  }

  /* READ */
  getTasks() {
    return [...this.tasks]; // Return a copy to avoid accidental mutations
  }

  getTaskById(taskId) {
    return this.tasks.find((task) => task.id === taskId) || null;
  }

  getTaskStatus(taskId) {
    const taskStatus = this.getTaskById(taskId);
    return taskStatus ? taskStatus.status : null;
  }

  /* UPDATE */ 
  updateTask(taskId, updatedData) {
    const task = this.getTaskById(taskId);
    if (!task) {
      console.warn("Task not found!");
      return null;
    }

    Object.assign(task, updatedData);
    this._saveTasks();
    return task;
  }

  toggleTaskStatus(taskId) {
    const task = this.getTaskById(taskId);
    if (!task) {
      console.warn("Task not found!");
      return null;
    }
    task.status = !task.status;
    this._saveTasks();
    return task;
  }

  /* DELETE */
  deleteTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this._saveTasks();
  }

  /* PERSISTENCE */
  _saveTasks() {
    try {
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  }

  _loadTasks() {
    try {
      return JSON.parse(localStorage.getItem("tasks")) || [];
    } catch (error) {
      console.error("Error loading tasks:", error);
      return [];
    }
  }

  /* FILTERS */
  sortTasks(criteria) {
    const sortFunctions = {
      dueDate: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      priority: (a, b) => ["High", "Medium", "Low"].indexOf(a.priority) - ["High", "Medium", "Low"].indexOf(b.priority),
    };

    return [...this.tasks].sort(sortFunctions[criteria]);
  }

  filterByPriority(priorityLevel) {
    return this.tasks.filter((task) => task.priority === priorityLevel);
  }
}

export { TaskService };
