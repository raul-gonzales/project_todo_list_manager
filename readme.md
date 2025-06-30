# Pro-Do: Project To-Do List Manager

The Pro-Do: Project To-Do List Manager is a structured task management application that helps users organize their tasks into projects. It allows users to create, edit, and delete tasks, categorize them, and store relevant details such as title, description, due date, priority, notes, and checklists.

The project focuses on maintaining clear separation of logic—handling todo operations separately from DOM manipulation for better maintainability.

Features include localStorage for persistence, filters for sorting tasks, priority indicators, and a polished UI for improved usability. It's designed for individuals who need an efficient way to manage daily tasks and projects.

## Project Tasks:

- [x] **Planning & Design**
  - [x] Define the core functionalities: creating, editing, deleting, and categorizing todos into projects.
  - [x] Decide what information each todo should store (title, description, due date, priority, notes).
  - [x] Sketch out the user interface, keeping usability in mind.

- [x] **Setting Up the Project**
  - [x] Initialize your project with `npm init` and set up Webpack.
  - [x] Install useful dependencies, like `date-fns` for date handling.

- [x] **Structuring Your Code**
  - [x] Use modules to separate concerns: one for managing todos/projects and another for handling DOM updates.
  - [x] Ensure separation of logic:
    - [x] Todo Logic Module: Handles adding, editing, deleting todos.
    - [x] Project Module: Manages projects, grouping related todos.
    - [x] DOM Module: Updates the webpage when users interact.

- [x] **Implementing Features**
  - [x] Create todo factory functions or classes to generate objects.
  - [x] Set up localStorage for saving todos persistently.
  - [x] Build event listeners to allow users to interact with the todos (adding, editing, deleting).

- [x] **Enhancing Functionality**
  - [x] Implement filters (e.g., sorting by due date or priority).
  - [x] Add visual cues for priorities (e.g., color coding).
  - [x] Make todos expandable to show details.
  - [x] Allow users to create and manage multiple projects.

- [x] **Debugging & Optimization**
  - [x] Test localStorage persistence and ensure todos load properly.
  - [x] Utilize DevTools for debugging.
  - [x] Refactor code for clarity and efficiency.

- [x] **Final Touches**
  - [x] Polish the UI with CSS for a clean, intuitive design.
  - [x] Add animations or transitions for better UX.
  - [x] Ensure responsiveness for different screen sizes.

- [ ] **Deployment & Feedback**
  - [ ] Host the project on GitHub Pages or Netlify.
