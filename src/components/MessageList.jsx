import React from 'react';
import Message from './Message';
import TypingDots from './TypingDots';
import '../styles/MessageList.css';

export default function MessageList({ messages, loading, bottomRef }) {
  return (
    <div className="message-list">
      <div className="message-list-inner">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        {loading && <TypingDots />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
