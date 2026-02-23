
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import InputBar from './InputBar';
import { sendMessage, resetHistory } from '../api/chat';
import '../styles/Chat.css';

let msgId = 0;
const uid = () => ++msgId;

export default function Chat() {
  const [sessions, setSessions] = useState([{ id: 1, title: 'New chat' }]);
  const [activeId, setActiveId] = useState(1);
  const [messageMap, setMessageMap] = useState({ 1: [] });
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);
  const bottomRef = useRef(null);

  const messages = messageMap[activeId] ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  const handleSend = useCallback(async (text) => {
    const userMsg = { id: uid(), role: 'user', content: text, ts: Date.now() };
    setMessageMap((prev) => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), userMsg] }));

    if (messages.length === 0) {
      const title = text.length > 36 ? text.slice(0, 36) + '…' : text;
      setSessions((prev) => prev.map((s) => (s.id === activeId ? { ...s, title } : s)));
    }

    setLoading(true);
    try {
      const reply = await sendMessage(text);
      setMessageMap((prev) => ({
        ...prev,
        [activeId]: [...(prev[activeId] ?? []), { id: uid(), role: 'assistant', content: reply, ts: Date.now() }],
      }));
    } catch {
      setMessageMap((prev) => ({
        ...prev,
        [activeId]: [...(prev[activeId] ?? []), { id: uid(), role: 'assistant', content: 'Something went wrong. Please try again.', error: true, ts: Date.now() }],
      }));
    } finally {
      setLoading(false);
    }
  }, [activeId, messages.length]);

  const handleNewChat = () => {
    const id = Date.now();
    setSessions((prev) => [{ id, title: 'New chat' }, ...prev]);
    setMessageMap((prev) => ({ ...prev, [id]: [] }));
    setActiveId(id);
    resetHistory();
    closeSidebarOnMobile();
  };

  const handleSelectSession = (id) => {
    setActiveId(id);
    closeSidebarOnMobile();
  };

  return (
    <div className="layout">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`sidebar-container ${sidebarOpen ? '' : 'sidebar-container--closed'}`}>
        <Sidebar
          sessions={sessions}
          activeId={activeId}
          onSelect={handleSelectSession}
          onNewChat={handleNewChat}
        />
      </div>

      <div className="main">
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Toggle sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {messages.length === 0 ? (
          <div className="empty-state">
            <p className="empty-heading">What can I help with?</p>
          </div>
        ) : (
          <MessageList messages={messages} loading={loading} bottomRef={bottomRef} />
        )}

        <div className={`input-wrap ${messages.length === 0 ? 'input-wrap--centered' : ''}`}>
          <InputBar onSend={handleSend} disabled={loading} />
          <p className="disclaimer">ChatGPT can make mistakes. Consider checking important information.</p>
        </div>
      </div>
    </div>
  );
}