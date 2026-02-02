import React, { useState, useEffect, useRef } from 'react'
import { chatService } from '../services/apiService'
import { Send, Bot, User } from 'lucide-react'

const Chat = () => {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        loadHistory()
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const loadHistory = async () => {
        const data = await chatService.getHistory()
        if (Array.isArray(data)) {
            const formatted = []
            data.forEach(chat => {
                formatted.push({ text: chat.message, sender: 'user', timestamp: chat.timestamp })
                formatted.push({ text: chat.response, sender: 'bot', timestamp: chat.timestamp, emotion: chat.emotion })
            })
            setMessages(formatted)
        }
    }

    const handleSend = async (e) => {
        e.preventDefault()
        if (!input.trim() || loading) return

        const userMsg = input
        setInput('')
        setMessages(prev => [...prev, { text: userMsg, sender: 'user', timestamp: new Date() }])

        setLoading(true)
        try {
            const data = await chatService.sendMessage(userMsg)
            setMessages(prev => [...prev, {
                text: data.response,
                sender: 'bot',
                timestamp: data.timestamp,
                emotion: data.emotion
            }])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>AI Companion</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>Empathetic listening 24/7</p>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            gap: '0.75rem'
                        }}>
                            {msg.sender === 'bot' && <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Bot size={20} /></div>}
                            <div style={{
                                maxWidth: '70%',
                                padding: '1rem 1.25rem',
                                borderRadius: '1.25rem',
                                borderBottomRightRadius: msg.sender === 'user' ? '0' : '1.25rem',
                                borderBottomLeftRadius: msg.sender === 'bot' ? '0' : '1.25rem',
                                background: msg.sender === 'user' ? 'var(--primary)' : '#f1f5f9',
                                color: msg.sender === 'user' ? 'white' : 'var(--text)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}>
                                {msg.text}
                                {msg.emotion && <div style={{ fontSize: '0.7rem', marginTop: '0.5rem', opacity: 0.7, fontStyle: 'italic' }}>Mood: {msg.emotion}</div>}
                            </div>
                            {msg.sender === 'user' && <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} /></div>}
                        </div>
                    ))}
                    {loading && <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>AI is typing...</div>}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem', padding: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                    <input
                        className="input"
                        placeholder="Share your thoughts..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Chat
