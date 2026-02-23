import React, { useState, useRef } from 'react';
import '../styles/InputBar.css';

export default function InputBar({ onSend, disabled }) {
  const [value, setValue] = useState('');
  const ref = useRef(null);

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue('');
    if (ref.current) ref.current.style.height = 'auto';
    ref.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    const el = ref.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="input-bar">
      <div className="input-container">
        <textarea
          ref={ref}
          className="input-textarea"
          placeholder="Message ChatGPT"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
        />
        <button
          className={`send-button ${canSend ? 'send-button--active' : ''}`}
          onClick={submit}
          disabled={!canSend}
          aria-label="Send"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
