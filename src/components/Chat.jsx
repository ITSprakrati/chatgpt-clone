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
  const bottomRef = useRef(null);

  const messages = messageMap[activeId] ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = useCallback(async (text) => {
    const userMsg = { id: uid(), role: 'user', content: text, ts: Date.now() };

    setMessageMap((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), userMsg],
    }));

    // use first message as session title
    if (messages.length === 0) {
      const title = text.length > 36 ? text.slice(0, 36) + '…' : text;
      setSessions((prev) =>
        prev.map((s) => (s.id === activeId ? { ...s, title } : s))
      );
    }

    setLoading(true);
    try {
      const reply = await sendMessage(text);
      const assistantMsg = { id: uid(), role: 'assistant', content: reply, ts: Date.now() };
      setMessageMap((prev) => ({
        ...prev,
        [activeId]: [...(prev[activeId] ?? []), assistantMsg],
      }));
    } catch (err) {
      const errMsg = {
        id: uid(),
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
        error: true,
        ts: Date.now(),
      };
      setMessageMap((prev) => ({
        ...prev,
        [activeId]: [...(prev[activeId] ?? []), errMsg],
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
  };

  return (
    <div className="layout">
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onSelect={setActiveId}
        onNewChat={handleNewChat}
      />
      <div className="main">
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
