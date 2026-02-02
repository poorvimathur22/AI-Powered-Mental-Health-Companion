import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

const Todo = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/habits/tasks', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            setTasks(data);
        } catch (err) {
            console.error(err);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const response = await fetch('http://localhost:5000/api/habits/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ text: newTask })
            });
            const data = await response.json();
            setTasks([...tasks, data]);
            setNewTask('');
        } catch (err) {
            console.error(err);
        }
    };

    const toggleTask = async (id, completed) => {
        try {
            await fetch(`http://localhost:5000/api/habits/tasks/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ completed: !completed })
            });
            setTasks(tasks.map(t => t._id === id ? { ...t, completed: !completed } : t));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>To-Do List</h2>

            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <form onSubmit={addTask} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <input
                        className="input"
                        placeholder="Add a new task..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                    <button className="btn btn-primary" type="submit">
                        <Plus size={20} />
                    </button>
                </form>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {tasks.map(task => (
                        <div key={task._id} className="glass" style={{
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: task.completed ? 'rgba(16, 185, 129, 0.05)' : 'white'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                <button
                                    onClick={() => toggleTask(task._id, task.completed)}
                                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: task.completed ? 'var(--secondary)' : 'var(--text-muted)' }}
                                >
                                    {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                                </button>
                                <span style={{
                                    textDecoration: task.completed ? 'line-through' : 'none',
                                    color: task.completed ? 'var(--text-muted)' : 'var(--text)'
                                }}>
                                    {task.text}
                                </span>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            No tasks yet. Start by adding one above!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Todo;
