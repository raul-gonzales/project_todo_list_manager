class Task {
  constructor(title, description, dueDate, priority, notes = "", status = false) {
    this.id = crypto.randomUUID().substring(2, 9); // Unique identifier
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.status = status;
  }

  /* GETTERS */
  getDetails() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      notes: this.notes,
    };
  }

  getStatus() {
    return this.status;
  }

  /* SETTERS */
  setStatus(status) {
    this.status = status;
  }

  toggleStatus() {
    this.status = !this.status;
  }

  /* UPDATING TASK DETAILS */
  updateTask(updatedData) {
    Object.assign(this, updatedData);
  }
}

export { Task };
