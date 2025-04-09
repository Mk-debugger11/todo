import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (
      prev === "light" ? "dark" : "light"
    ));
  };

  const addTask = () => {
    if (task.trim() === "") return;
    setTasks([...tasks, { text: task, completed: false }]);
    setTask("");
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const toggleComplete = (index) => {
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") addTask();
  };

  const startEditing = (index) => {
    setEditIndex(index);
    setEditText(tasks[index].text);
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditText("");
  };

  const saveEdit = (index) => {
    if (editText.trim() === "") return;
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, text: editText } : t
    );
    setTasks(updatedTasks);
    cancelEdit();
  };
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark' : '';
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="app">
      <header className="header">
        <h1>📝 My To-Do List</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </header>
      <main className="main">
        <div className="input-group">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Add a new task..."
          />
          <button onClick={addTask}>Add</button>
        </div>

        <ul className="task-list">
          {tasks.map((t, i) => (
            <li key={i} className={`task-item ${t.completed ? 'completed' : ''}`}>
              {editIndex === i ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => saveEdit(i)}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </div>
              ) : (
                <>
                  <label>
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggleComplete(i)}
                    />
                    <span>{t.text}</span>
                  </label>
                  <div className="task-actions">
                    <button className="edit-btn" onClick={() => startEditing(i)}>✏️</button>
                    <button className="delete-btn" onClick={() => deleteTask(i)}>❌</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
