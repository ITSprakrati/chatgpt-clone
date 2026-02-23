import React from 'react';
import '../styles/Message.css';

export default function Message({ message }) {
  const { role, content, error } = message;
  const isUser = role === 'user';

  return (
    <div className={`message-row ${isUser ? 'message-row--user' : 'message-row--assistant'}`}>
      <div className="message-author">
        {isUser ? (
          <span className="author-label author-label--user">You</span>
        ) : (
          <span className="author-label author-label--assistant">ChatGPT</span>
        )}
      </div>
      <div className={`message-content ${error ? 'message-content--error' : ''}`}>
        {content}
      </div>
    </div>
  );
}
