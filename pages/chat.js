import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { format } from 'date-fns';

function ChatLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.toLowerCase() !== 'panjabzindabad') {
      setError('Incorrect password.');
      return;
    }
    if (!name.trim()) {
      setError('Please enter a display name.');
      return;
    }
    setError('');
    onLogin(name.trim());
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'var(--paper)',
      backgroundImage: 'radial-gradient(circle at top right, rgba(245,158,11,0.05), transparent 40%), radial-gradient(circle at bottom left, rgba(15,23,42,0.05), transparent 40%)'
    }}>
      <Head><title>Group Chat Login — The Punjab Times</title></Head>
      <div style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.6)',
        borderRadius: 'var(--radius-xl)',
        padding: '3rem 2.5rem',
        width: '100%',
        maxWidth: '440px',
        boxShadow: 'var(--shadow-modal)'
      }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--ink)', marginBottom: '0.5rem', textAlign: 'center' }}>
          Enter Group Chat
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--slate)', marginBottom: '2rem', textAlign: 'center' }}>
          Please provide the password and your temporary name.
        </p>

        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5',
            padding: '0.7rem 1rem', marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--danger)', borderRadius: 'var(--radius-md)'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="field-label" htmlFor="gc-password">Password</label>
            <input id="gc-password" type="password" className="field-input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password..." />
          </div>
          <div>
            <label className="field-label" htmlFor="gc-name">Display Name</label>
            <input id="gc-name" type="text" className="field-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ali Raza" maxLength={50} />
          </div>
          <button type="submit" className="btn-saffron" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
}

function ChatRoom({ userName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const chatContainerRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch messages', e);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const msgContent = input.trim();
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: userName, content: msgContent }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.data]);
      }
    } catch (e) {
      console.error('Failed to send message', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--paper-2)'
    }}>
      <Head><title>Group Chat — The Punjab Times</title></Head>
      
      <header style={{
        background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)',
        padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0, zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="/" style={{
            width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white)',
            transition: 'all var(--transition-fast)'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
          </a>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--white)', lineHeight: 1 }}>
              Group Chat
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
              Logged in as <span style={{ color: 'var(--saffron)' }}>{userName}</span>
            </p>
          </div>
        </div>
      </header>

      <div ref={chatContainerRef} style={{
        flex: 1, padding: '2rem', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: '1rem',
        backgroundImage: 'radial-gradient(circle at center, rgba(15,23,42,0.03) 0%, transparent 100%)'
      }}>
        {messages.length === 0 ? (
          <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--slate)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender === userName;
            return (
              <div key={msg._id || idx} style={{
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '75%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMe ? 'flex-end' : 'flex-start'
              }}>
                {!isMe && (
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 600,
                    color: 'var(--slate)', marginLeft: '4px', marginBottom: '4px'
                  }}>
                    {msg.sender}
                  </span>
                )}
                <div style={{
                  background: isMe ? 'var(--saffron)' : 'var(--white)',
                  color: isMe ? 'var(--white)' : 'var(--ink)',
                  padding: '0.75rem 1rem',
                  borderRadius: isMe ? '16px 16px 0 16px' : '16px 16px 16px 0',
                  boxShadow: 'var(--shadow-card)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                  position: 'relative'
                }}>
                  {msg.content}
                </div>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.65rem',
                  color: 'var(--slate-2)', marginTop: '4px',
                  marginRight: isMe ? '4px' : '0', marginLeft: isMe ? '0' : '4px'
                }}>
                  {msg.createdAt ? format(new Date(msg.createdAt), 'h:mm a') : ''}
                </span>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <div style={{
        padding: '1rem 2rem', background: 'var(--white)', borderTop: '1px solid var(--rule)',
        flexShrink: 0
      }}>
        <form onSubmit={sendMessage} style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          maxWidth: '1000px', margin: '0 auto'
        }}>
          <input
            type="text"
            className="field-input"
            style={{ borderRadius: '99px', padding: '0.85rem 1.5rem', background: 'var(--paper)' }}
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="btn-saffron" disabled={!input.trim() || loading} style={{
            borderRadius: '50%', width: '48px', height: '48px', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [userName, setUserName] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const auth = sessionStorage.getItem('pt_chat_auth');
    const name = sessionStorage.getItem('pt_chat_name');
    if (auth === 'true' && name) {
      setUserName(name);
    }
  }, []);

  const handleLogin = (name) => {
    sessionStorage.setItem('pt_chat_auth', 'true');
    sessionStorage.setItem('pt_chat_name', name);
    setUserName(name);
  };

  if (!isClient) return null;

  if (!userName) {
    return <ChatLogin onLogin={handleLogin} />;
  }

  return <ChatRoom userName={userName} />;
}
