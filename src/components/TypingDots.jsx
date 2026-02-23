import React from 'react';
import '../styles/TypingDots.css';

export default function TypingDots() {
  return (
    <div className="message-row message-row--assistant">
      <div className="message-author">
        <span className="author-label author-label--assistant">ChatGPT</span>
      </div>
      <div className="typing-dots">
        <span /><span /><span />
      </div>
    </div>
  );
}
