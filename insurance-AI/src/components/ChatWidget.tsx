import React, { useState, useRef, useEffect } from 'react';

type Message = {
  id: string;
  from: 'user' | 'bot';
  text: string;
  ts: number;
};

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const raw = localStorage.getItem('chat_messages');
      return raw ? JSON.parse(raw) as Message[] : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: String(Date.now()) + '-u', from: 'user', text, ts: Date.now() };
    setMessages(m => [...m, userMsg]);
    setInput('');

    // Attempt to ask backend (/chat) which will proxy to OpenAI.
    // We will send the full conversation so the model has context.
    (async () => {
      try {
        // build messages array for API: map 'user'|'bot' -> 'user'|'assistant'
        const toSend = ([...messages, userMsg]).map(m => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text }));

        const res = await fetch('http://localhost:3000/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: toSend })
        });

        if (!res.ok) {
          // backend or provider error — fallback to local reply
          const raw = await res.text();
          console.warn('Chat proxy returned non-OK:', res.status, raw);
          const fallback = makeAutoReply(text);
          const botMsg: Message = { id: String(Date.now()) + '-b', from: 'bot', text: fallback, ts: Date.now() };
          setMessages(m => [...m, botMsg]);
          return;
        }

        const json = await res.json();
        let assistantText = json?.reply ?? null;
        // As a safety: try to extract a message from choices if present
        if (!assistantText && json?.raw?.choices?.[0]) {
          assistantText = json.raw.choices[0].message?.content ?? json.raw.choices[0].text ?? JSON.stringify(json.raw.choices[0]);
        }

        if (!assistantText) assistantText = makeAutoReply(text);

        const botMsg: Message = { id: String(Date.now()) + '-b', from: 'bot', text: assistantText, ts: Date.now() };
        setMessages(m => [...m, botMsg]);
      } catch (err) {
        // network or other error, fallback to local reply
        console.error('Error calling /chat endpoint, falling back to local reply:', err);
        const fallback = makeAutoReply(text);
        const botMsg: Message = { id: String(Date.now()) + '-b', from: 'bot', text: fallback, ts: Date.now() };
        setMessages(m => [...m, botMsg]);
      }
    })();
  };

  const makeAutoReply = (userText: string) => {
    const text = userText.toLowerCase();
    if (text.includes('hello') || text.includes('hi')) return 'Hello — how can I help you today?';
    if (text.includes('policy') && text.includes('house')) return 'You can view house policy details in the policies tab; would you like the policy number?';
    if (text.includes('policy') && text.includes('motor')) return 'Motor policies include vehicle details — check the motor policy view for details.';
    if (text.includes('sally') || text.includes('nima') || text.includes('charlie')) return 'I can fetch policy details for that user — ask me for `policies for <name>`.';
    return "Thanks — I'll forward this to an agent. For now, try asking about 'house' or 'motor' policies.";
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    sendMessage(input);
  };

  const clear = () => setMessages([]);

  return (
    <div style={{ position: 'fixed', left: 16, bottom: 16, zIndex: 9999 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        {open && (
          <div style={{ width: 320, maxWidth: 'clamp(240px, 28vw, 420px)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', borderRadius: 12, overflow: 'hidden', background: '#fff', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 12px', background: '#0f172a', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Chat</strong>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={clear} aria-label="clear chat" style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>Clear</button>
                <button onClick={() => setOpen(false)} aria-label="close chat" style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>✕</button>
              </div>
            </div>

            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, height: 240, overflowY: 'auto' }}>
              {messages.length === 0 && <div style={{ color: '#6b7280', fontSize: 13 }}>No messages yet — say hi 👋</div>}
              {messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                  {msg.from === 'bot' && (
                    <div style={{ width: 32, height: 32, background: '#0f172a', color: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>AI</div>
                  )}
                  <div style={{ background: msg.from === 'user' ? '#0684ff' : '#f3f4f6', color: msg.from === 'user' ? '#fff' : '#111827', padding: '8px 10px', borderRadius: 8, maxWidth: '78%', fontSize: 14 }}>
                    {msg.text}
                  </div>
                  {msg.from === 'user' && (
                    <div style={{ width: 32, height: 32, background: '#064e3b', color: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>You</div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, padding: 8, borderTop: '1px solid #e6edf6' }}>
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message…" style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <button type="submit" style={{ padding: '8px 12px', background: '#0f172a', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer' }}>Send</button>
            </form>
          </div>
        )}

        <button aria-label="open-chat" onClick={() => setOpen(o => !o)} style={{ width: 56, height: 56, borderRadius: 16, background: '#0f172a', color: '#fff', border: 'none', boxShadow: '0 6px 20px rgba(15,23,42,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          💬
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
