import React, { useState, useEffect } from 'react';
import { Phone, Plus, Trash2, UserPlus } from 'lucide-react';

const Emergency = () => {
    const [contacts, setContacts] = useState([]);
    const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/emergency/', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            setContacts(data);
        } catch (err) {
            console.error(err);
        }
    };

    const addContact = async (e) => {
        e.preventDefault();
        if (!newContact.name || !newContact.phone) return;

        try {
            const response = await fetch('http://localhost:5000/api/emergency/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newContact)
            });
            const data = await response.json();
            setContacts([...contacts, data]);
            setNewContact({ name: '', phone: '', relation: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const deleteContact = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/emergency/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setContacts(contacts.filter(c => c._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '1rem' }}>Emergency Contacts</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Quickly access help when you need it most.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <UserPlus size={20} /> Add Contact
                    </h3>
                    <form onSubmit={addContact} style={{ display: 'grid', gap: '1rem' }}>
                        <input
                            className="input"
                            placeholder="Full Name"
                            value={newContact.name}
                            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        />
                        <input
                            className="input"
                            placeholder="Phone Number"
                            value={newContact.phone}
                            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                        />
                        <input
                            className="input"
                            placeholder="Relation (e.g. Spouse, Doctor)"
                            value={newContact.relation}
                            onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                        />
                        <button className="btn btn-primary" type="submit">Add Contact</button>
                    </form>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {contacts.map(contact => (
                        <div key={contact._id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--primary)'
                                }}>
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0 }}>{contact.name}</h4>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{contact.relation}</p>
                                    <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--primary)' }}>{contact.phone}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteContact(contact._id)}
                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                    {contacts.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', background: 'white', borderRadius: '1rem', border: '1px dashed #e2e8f0' }}>
                            No contacts added yet.
                        </div>
                    )}
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem', background: '#fef2f2', borderColor: '#fee2e2' }}>
                <h3 style={{ color: '#991b1b', marginBottom: '0.5rem' }}>National Helplines</h3>
                <p style={{ color: '#b91c1c' }}>If you are in immediate danger, please call emergency services or a national suicide prevention lifeline.</p>
                <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
                    Lifeline: 988 (USA) | 112 (India) | 999 (UK)
                </div>
            </div>
        </div>
    );
};

export default Emergency;
