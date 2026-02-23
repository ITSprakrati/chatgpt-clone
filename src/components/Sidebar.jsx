import React from 'react';
import '../styles/Sidebar.css';

export default function Sidebar({ sessions, activeId, onSelect, onNewChat }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <button className="new-chat-btn" onClick={onNewChat}>
          <span className="new-chat-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          New chat
        </button>
      </div>

      <nav className="session-list">
        {sessions.map((s) => (
          <button
            key={s.id}
            className={`session-item ${s.id === activeId ? 'session-item--active' : ''}`}
            onClick={() => onSelect(s.id)}
          >
            <span className="session-title">{s.title}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-row">
          <div className="user-avatar">U</div>
          <span className="user-name">User</span>
        </div>
      </div>
    </aside>
  );
}
