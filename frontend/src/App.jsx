import { useState, useEffect } from 'react';
import axios from 'axios';

// Load API URL from environment variable
const API = window?.env?.VITE_API_URL;

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    axios.get(API).then(res => setTodos(res.data));
  }, []);

  const addTodo = async () => {
    if (!title.trim()) return;
    const res = await axios.post(API, { title });
    setTodos([...todos, res.data]);
    setTitle('');
  };

  const toggleTodo = async (id, completed) => {
    const res = await axios.put(`${API}/${id}`, { completed: !completed });
    setTodos(todos.map(t => t.id === id ? res.data : t));
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API}/${id}`);
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📝 Todo App </h2>
      <h4> Argocd automatically update images works! </h4>
      <div style={styles.inputRow}>
        <input 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          style={styles.input}
          placeholder="Add a new task..."
        />
        <button onClick={addTodo} style={styles.addButton}>Add</button>
      </div>
      <ul style={styles.todoList}>
        {todos.map(t => (
          <li key={t.id} style={styles.todoItem}>
            <span 
              onClick={() => toggleTodo(t.id, t.completed)}
              style={{
                ...styles.todoText,
                textDecoration: t.completed ? 'line-through' : 'none',
                color: t.completed ? '#888' : '#333'
              }}
            >
              {t.title}
            </span>
            <button onClick={() => deleteTodo(t.id)} style={styles.deleteButton}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 500,
    margin: '0 auto', // Fixed typo: ' 0auto' → '0 auto'
    padding: '2rem',
    background: '#fdfdfd',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333'
  },
  inputRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem'
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc'
  },
  addButton: {
    padding: '0.75rem 1.25rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  todoList: {
    listStyle: 'none',
    padding: 0
  },
  todoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    background: '#f1f1f1',
    borderRadius: '8px',
    marginBottom: '0.75rem',
    alignItems: 'center'
  },
  todoText: {
    fontSize: '1.05rem',
    cursor: 'pointer',
    flex: 1
  },
  deleteButton: {
    background: 'transparent',
    border: 'none',
    color: '#cc0000',
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginLeft: '1rem'
  }
};

export default App;
